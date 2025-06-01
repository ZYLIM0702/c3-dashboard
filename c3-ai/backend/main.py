from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

# Allow CORS for dashboard/frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Example device telemetry input
class TelemetryInput(BaseModel):
    device_id: str
    battery: float
    signal: float
    temperature: float
    humidity: float
    # Add more fields as needed

# Example ML analytics output
class MLAnalytics(BaseModel):
    device_id: str
    risk_score: float
    anomaly: bool
    label: str

@app.post("/ml/analytics", response_model=MLAnalytics)
def get_ml_analytics(data: TelemetryInput):
    # TODO: Replace with real ML model inference
    risk_score = random.uniform(0, 1)
    anomaly = risk_score > 0.7
    label = "At Risk" if anomaly else "Normal"
    return MLAnalytics(
        device_id=data.device_id,
        risk_score=risk_score,
        anomaly=anomaly,
        label=label,
    )

@app.get("/ml/analytics/all")
def get_all_ml_analytics():
    # TODO: Fetch all devices and run inference for each
    # For now, return dummy data
    return [
        {
            "device_id": f"device_{i}",
            "risk_score": random.uniform(0, 1),
            "anomaly": random.choice([True, False]),
            "label": random.choice(["Normal", "At Risk"]),
        }
        for i in range(10)
    ]