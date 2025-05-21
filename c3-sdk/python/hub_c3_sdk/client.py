"""
Hub C3 Python SDK - Client
"""
import asyncio
from .config import DeviceConfig
from .models import SensorData, AlertLevel
from .lora import LoRaInterface

class HubClient:
    def __init__(self, endpoint: str, api_key: str, device_config: DeviceConfig, transport: str = "wifi", lora_port: str = "/dev/ttyUSB0"):
        self.endpoint = endpoint
        self.api_key = api_key
        self.device_config = device_config
        self.connected = False
        self.transport = transport
        self.lora = LoRaInterface(lora_port) if transport == "lora" else None

    async def connect(self):
        if self.transport == "lora":
            self.lora.connect()
            self.connected = self.lora.connected
        else:
            # Simulate connection
            await asyncio.sleep(0.1)
            self.connected = True

    async def disconnect(self):
        if self.transport == "lora" and self.lora:
            self.lora.disconnect()
        self.connected = False

    async def register_device(self, config=None):
        # Simulate registration
        await asyncio.sleep(0.1)
        return {"status": "registered", "device_id": self.device_config.device_id}

    async def send_telemetry(self, sensor_data: SensorData):
        if self.transport == "lora" and self.lora:
            self.lora.send(str(sensor_data).encode())
            return {"status": "ok", "via": "lora"}
        # Simulate sending telemetry
        await asyncio.sleep(0.05)
        return {"status": "ok", "via": "wifi"}

    async def send_alert(self, alert):
        if self.transport == "lora" and self.lora:
            self.lora.send(str(alert).encode())
            return {"status": "alert_sent", "via": "lora"}
        # Simulate sending alert
        await asyncio.sleep(0.05)
        return {"status": "alert_sent", "via": "wifi"}

    async def subscribe_alerts(self, callback):
        # Simulate alert subscription
        pass

    async def subscribe_commands(self, callback):
        # Simulate command subscription
        pass
