from fastapi import FastAPI, HTTPException, Header, Request, Response, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel
import secrets
import os
from supabase import create_client, Client
from typing import List, Optional, Dict, Any
import time
from datetime import datetime

SUPABASE_URL = os.environ.get("SUPABASE_URL", "<your-supabase-url>")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "<your-supabase-key>")
if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set as environment variables.")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

# CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class UserRegistration(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class DeviceRegistration(BaseModel):
    device_type: str
    device_name: str
    user_id: str

class Device(BaseModel):
    id: Optional[str]
    device_type: str
    device_name: str
    user_id: str
    api_key: str

class Telemetry(BaseModel):
    device_id: str
    timestamp: float
    data: dict

class VideoStreamRegistration(BaseModel):
    device_id: str
    stream_url: str  # RTSP/HTTP/other
    stream_type: str  # e.g. 'rtsp', 'http', 'hls'

class LoRaMessage(BaseModel):
    sender_id: str
    receiver_id: str
    message: str
    timestamp: Optional[float] = None

# --- User Endpoints ---
@app.post("/register-user")
def register_user(user: UserRegistration):
    # Store user in Supabase (no password hashing for prototype)
    result = supabase.table("users").insert({
        "email": user.email,
        "password": user.password
    }).execute()
    if result.error:
        raise HTTPException(status_code=500, detail=str(result.error))
    return {"status": "registered"}

@app.post("/login")
def login(user: UserLogin):
    result = supabase.table("users").select("*").eq("email", user.email).eq("password", user.password).single().execute()
    if result.error or not result.data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # Return a mock token (for prototype)
    token = secrets.token_urlsafe(16)
    return {"token": token, "user_id": result.data["id"]}

# --- Device API Key Rotation ---
@app.post("/devices/{device_id}/rotate-key")
def rotate_api_key(device_id: str):
    new_key = secrets.token_urlsafe(32)
    result = supabase.table("devices").update({"api_key": new_key}).eq("id", device_id).execute()
    if result.error:
        raise HTTPException(status_code=500, detail=str(result.error))
    return {"device_id": device_id, "api_key": new_key}

# --- Device Authentication Dependency ---
def get_device_by_key(x_api_key: str = Header(...)):
    result = supabase.table("devices").select("*").eq("api_key", x_api_key).single().execute()
    if result.error or not result.data:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return result.data

# --- Device Endpoints ---
@app.post("/register-device")
def register_device(reg: DeviceRegistration):
    api_key = secrets.token_urlsafe(32)
    result = supabase.table("devices").insert({
        "device_type": reg.device_type,
        "device_name": reg.device_name,
        "user_id": reg.user_id,
        "api_key": api_key
    }).execute()
    if result.error:
        raise HTTPException(status_code=500, detail=str(result.error))
    return {"device_id": reg.device_name, "api_key": api_key}

@app.get("/devices", response_model=List[Device])
def list_devices():
    result = supabase.table("devices").select("*").execute()
    if result.error:
        raise HTTPException(status_code=500, detail=str(result.error))
    return result.data

@app.get("/devices/{device_id}", response_model=Device)
def get_device(device_id: str):
    result = supabase.table("devices").select("*").eq("id", device_id).single().execute()
    if result.error:
        raise HTTPException(status_code=404, detail="Device not found")
    return result.data

@app.put("/devices/{device_id}", response_model=Device)
def update_device(device_id: str, device: Device):
    result = supabase.table("devices").update(device.dict()).eq("id", device_id).execute()
    if result.error:
        raise HTTPException(status_code=500, detail=str(result.error))
    return result.data[0]

@app.delete("/devices/{device_id}")
def delete_device(device_id: str):
    result = supabase.table("devices").delete().eq("id", device_id).execute()
    if result.error:
        raise HTTPException(status_code=500, detail=str(result.error))
    return {"status": "deleted"}

# --- Telemetry Endpoints ---
@app.post("/telemetry")
def add_telemetry(data: Telemetry, device=Depends(get_device_by_key)):
    result = supabase.table("telemetry").insert(data.dict()).execute()
    if result.error:
        raise HTTPException(status_code=500, detail=str(result.error))
    return {"status": "ok"}

@app.get("/telemetry/{device_id}")
def get_telemetry(device_id: str):
    result = supabase.table("telemetry").select("*").eq("device_id", device_id).order("timestamp", desc=True).limit(100).execute()
    if result.error:
        raise HTTPException(status_code=500, detail=str(result.error))
    return result.data

@app.get("/telemetry/stream/{device_id}")
def stream_telemetry(device_id: str):
    def event_stream():
        last_ts = 0
        while True:
            result = supabase.table("telemetry").select("*").eq("device_id", device_id).order("timestamp", desc=True).limit(1).execute()
            if result.data and result.data[0]["timestamp"] > last_ts:
                last_ts = result.data[0]["timestamp"]
                yield f"data: {result.data[0]}\n\n"
            time.sleep(2)
    return StreamingResponse(event_stream(), media_type="text/event-stream")

# --- Search/Filter Devices ---
@app.get("/devices/search")
def search_devices(q: str = ""):  # Simple search by name/type
    result = supabase.table("devices").select("*").ilike("device_name", f"%{q}%").execute()
    if result.error:
        raise HTTPException(status_code=500, detail=str(result.error))
    return result.data

# --- Video Streaming Endpoints ---
@app.post("/video/register")
def register_video_stream(reg: VideoStreamRegistration):
    # Store stream metadata in Supabase
    result = supabase.table("video_streams").insert({
        "device_id": reg.device_id,
        "stream_url": reg.stream_url,
        "stream_type": reg.stream_type
    }).execute()
    if result.error:
        raise HTTPException(status_code=500, detail=str(result.error))
    return {"status": "registered"}

@app.get("/video/streams")
def list_video_streams():
    result = supabase.table("video_streams").select("*").execute()
    if result.error:
        raise HTTPException(status_code=500, detail=str(result.error))
    return result.data

@app.get("/video/stream-proxy/{device_id}")
def video_stream_proxy(device_id: str):
    # For prototype: return the stream URL (in production, proxy/relay the stream)
    result = supabase.table("video_streams").select("*").eq("device_id", device_id).single().execute()
    if result.error or not result.data:
        raise HTTPException(status_code=404, detail="Stream not found")
    return {"stream_url": result.data["stream_url"], "stream_type": result.data["stream_type"]}

# --- LoRa Messaging Endpoints ---
@app.post("/lora/message")
def send_lora_message(msg: LoRaMessage):
    ts = msg.timestamp or datetime.utcnow().timestamp()
    result = supabase.table("lora_messages").insert({
        "sender_id": msg.sender_id,
        "receiver_id": msg.receiver_id,
        "message": msg.message,
        "timestamp": ts
    }).execute()
    if result.error:
        raise HTTPException(status_code=500, detail=str(result.error))
    return {"status": "sent"}

@app.get("/lora/messages/{node_id}")
def get_lora_messages(node_id: str, since: Optional[float] = None):
    query = supabase.table("lora_messages").select("*").eq("receiver_id", node_id)
    if since:
        query = query.gte("timestamp", since)
    result = query.order("timestamp", desc=False).limit(100).execute()
    if result.error:
        raise HTTPException(status_code=500, detail=str(result.error))
    return result.data

@app.get("/lora/messages/stream/{node_id}")
def stream_lora_messages(node_id: str):
    def event_stream():
        last_ts = 0
        while True:
            result = supabase.table("lora_messages").select("*").eq("receiver_id", node_id).order("timestamp", desc=False).gte("timestamp", last_ts).limit(1).execute()
            if result.data:
                for msg in result.data:
                    if msg["timestamp"] > last_ts:
                        last_ts = msg["timestamp"]
                        yield f"data: {msg}\n\n"
            time.sleep(2)
    return StreamingResponse(event_stream(), media_type="text/event-stream")

# --- Health Check ---
@app.get("/health")
def health():
    return {"status": "ok"}
