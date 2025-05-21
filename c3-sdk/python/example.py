import asyncio
from hub_c3_sdk.client import HubClient
from hub_c3_sdk.config import DeviceConfig
from hub_c3_sdk.models import SensorData, AlertLevel

async def main():
    config = DeviceConfig(
        device_id="env_station_kl_001",
        device_type="environmental_station",
        location={"lat": 3.1390, "lon": 101.6869},
        capabilities=["temperature", "humidity", "co2", "seismometer"]
    )
    client = HubClient(endpoint="https://api.hub-c3.org", api_key="your_api_key_here", device_config=config)
    await client.connect()
    await client.register_device()
    data = SensorData(timestamp=0, device_id=config.device_id, readings={"temperature": 25.0}, location=config.location)
    await client.send_telemetry(data)
    await client.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
