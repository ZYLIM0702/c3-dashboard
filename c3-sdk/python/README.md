# HUB C3 Python SDK

A Python SDK for connecting devices, sensors, and applications to the HUB C3 platform.

## Features
- Device registration and management
- Telemetry and alert sending
- LoRa, WiFi, Cellular, and HTTP support
- Video stream registration and retrieval
- LoRa text messaging (chat)

## Installation
```bash
cd c3-sdk/python
pip install .
```

## Usage Example
```python
from hub_c3_sdk.client import HubClient
from hub_c3_sdk.config import DeviceConfig
from hub_c3_sdk.models import SensorData
from hub_c3_sdk.video import VideoStreamClient

config = DeviceConfig(
    device_id="env_station_kl_001",
    device_type="environmental_station",
    location={"lat": 3.1390, "lon": 101.6869},
    capabilities=["temperature", "humidity", "co2", "seismometer"]
)
client = HubClient(endpoint="https://api.hub-c3.org", api_key="your_api_key", device_config=config)

# Register device, send telemetry, etc.
```

## Video Streaming
```python
video = VideoStreamClient("https://api.hub-c3.org")
video.register_stream("device_id", "rtsp://...", "rtsp")
streams = video.list_streams()
```

## LoRa Messaging
See `lora.py` for LoRa abstraction and chat support.
