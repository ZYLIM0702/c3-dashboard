# HUB C3 SDK - Command & Control Center Software Development Kit

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [Python SDK](#python-sdk)
5. [C++ SDK](#c-sdk)
6. [ROS SDK](#ros-sdk)
7. [Node.js SDK](#nodejs-sdk)
8. [Embedded Systems Integration](#embedded-systems-integration)
9. [Communication Protocols](#communication-protocols)
10. [API Reference](#api-reference)
11. [Examples & Use Cases](#examples--use-cases)
12. [Troubleshooting](#troubleshooting)

## Overview

The HUB C3 SDK provides a unified interface for connecting various devices, sensors, and systems to the Humanitarian Unified Backbone Command & Control Center. It supports multiple programming languages and communication protocols to ensure maximum compatibility with embedded systems, IoT devices, and edge computing platforms.

### Key Features
- **Multi-language support**: Python, C++, Node.js, **Flutter**
- **Protocol agnostic**: MQTT, LoRaWAN, HTTP/REST, WebSocket
- **LoRa/LoRaWAN support**: Native LoRa transport for low-power, long-range communication (Python, C++, Node.js)
- **Embedded system ready**: Arduino, Raspberry Pi, ROS integration
- **Real-time communication**: Live telemetry and alerts
- **Device management**: Auto-discovery and registration
- **Security**: TLS/SSL encryption and authentication
- **Offline capability**: Local buffering and sync

### Supported Devices
- Environmental monitoring stations
- Smart Emergency Helmets (SEH)
- Wearable devices
- Drone payload modules
- Mobile applications
- Custom IoT sensors

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HUB C3 SDK Architecture                  │
├─────────────────────────────────────────────────────────────┤
│  Application Layer                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ ┌─────────────┐   │
│  │   Python    │ │    C++      │ │      Node.js        │ │   Flutter   │   │
│  │     SDK     │ │    SDK      │ │        SDK          │ │    SDK      │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘ └─────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Protocol Abstraction Layer                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐     │
│  │  MQTT   │ │ LoRaWAN │ │  HTTP   │ │  WebSocket   │     │
│  └─────────┘ └─────────┘ └─────────┘ └──────────────┘     │
├─────────────────────────────────────────────────────────────┤
│  Transport Layer                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐     │
│  │   WiFi  │ │ Ethernet│ │ Cellular│ │    LoRa      │     │
│  └─────────┘ └─────────┘ └─────────┘ └──────────────┘     │
├─────────────────────────────────────────────────────────────┤
│  Hardware Layer                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐     │
│  │ Arduino │ │ RasPi   │ │   ROS   │ │  Custom HW   │     │
│  └─────────┘ └─────────┘ └─────────┘ └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Installation & Setup

### Prerequisites
- Python 3.7+
- Node.js 14+
- GCC/G++ compiler for C++
- CMake 3.10+

### Environment Setup

```bash
# Create project directory
mkdir hub-c3-integration
cd hub-c3-integration

# Python virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt
npm install
```

## Python SDK

### Installation

```bash
cd c3-sdk/python
pip install .
```

### Basic Usage (WiFi/Cellular/LoRa)

```python
from hub_c3_sdk import HubClient, DeviceConfig, SensorData, AlertLevel
import asyncio

# For LoRa support, set transport="lora" and specify lora_port if needed
config = DeviceConfig(
    device_id="env_station_kl_001",
    device_type="environmental_station",
    location={"lat": 3.1390, "lon": 101.6869},
    capabilities=["seismometer", "temperature", "humidity", "co2"]
)

client = HubClient(
    endpoint="https://api.hub-c3.org",
    api_key="your_api_key_here",
    device_config=config,
    transport="lora",           # Use "wifi", "cellular", or "lora"
    lora_port="/dev/ttyUSB0"    # Optional: LoRa serial port
)

async def main():
    await client.connect()
    await client.register_device()
    data = SensorData(timestamp=0, device_id=config.device_id, readings={"temperature": 25.0}, location=config.location)
    await client.send_telemetry(data)
    await client.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
```

### Advanced Features

```python
# Real-time data streaming
class StreamingClient:
    def __init__(self, device_id: str):
        self.client = HubClient(device_id=device_id)
        
    async def stream_data(self):
        """Stream real-time sensor data"""
        async with self.client.create_stream() as stream:
            async for sensor_data in self.read_sensor_stream():
                await stream.send(sensor_data)
                
    async def read_sensor_stream(self):
        """Generator for continuous sensor readings"""
        while True:
            # Yield sensor data
            yield await self.read_sensors()
            await asyncio.sleep(0.1)  # 10Hz sampling

# Device fleet management
class FleetManager:
    def __init__(self):
        self.devices = {}
        
    async def register_device(self, device_config):
        """Register a new device in the fleet"""
        client = HubClient(device_config=device_config)
        await client.connect()
        self.devices[device_config.device_id] = client
        
    async def broadcast_command(self, command):
        """Send command to all devices"""
        tasks = []
        for device_id, client in self.devices.items():
            tasks.append(client.send_command(command))
        await asyncio.gather(*tasks)
```

## C++ SDK

### Installation

```bash
cd c3-sdk/cpp
mkdir build && cd build
cmake ..
make -j4
sudo make install
```

### Usage Example (WiFi/Cellular/LoRa)

```cpp
#include <hub_c3_sdk/hub_client.hpp>
#include <iostream>
using namespace hub_c3_sdk;

int main() {
    DeviceConfig config{"env_station_kl_001", "environmental_station", "your_api_key_here", {3.1390, 101.6869}, {"temperature", "humidity", "co2", "seismometer"}};
    // Use LoRa transport
    HubClient client(config, HubClient::Transport::LORA, "/dev/ttyUSB0");
    if (!client.connect()) { std::cerr << "Failed to connect" << std::endl; return 1; }
    client.register_device();
    SensorData data{"env_station_kl_001", 0, {}};
    client.send_telemetry(data);
    client.disconnect();
    return 0;
}
```

## ROS SDK

The ROS SDK can leverage the C++ SDK's LoRa support. To use LoRa as a transport, configure the underlying C++ client in your ROS node to use `Transport::LORA` and specify the LoRa port.

### Installation

```bash
cd c3-sdk/ros
catkin_make
source devel/setup.bash
```

### Usage Example

```bash
rosrun c3_ros_node c3_ros_node_main
```

## Node.js SDK

### Installation

```bash
cd c3-sdk/nodejs
npm install
```

### Basic Usage (WiFi/Cellular/LoRa)

```js
const { HubClient, DeviceConfig } = require('hub-c3-sdk');

const config = new DeviceConfig({
  deviceId: 'env_station_kl_001',
  deviceType: 'environmental_station',
  apiKey: 'YOUR_API_KEY',
  location: { lat: 3.1390, lon: 101.6869 },
  capabilities: ['temperature', 'humidity', 'co2', 'seismometer'],
});

const client = new HubClient({
  endpoint: 'https://api.hub-c3.org',
  deviceConfig: config,
  transport: 'lora',      // Use 'wifi', 'cellular', or 'lora'
  loraPort: '/dev/ttyUSB0'// Optional: LoRa serial port
});

(async () => {
  await client.connect();
  await client.registerDevice();
  await client.sendTelemetry({
    timestamp: Date.now(),
    deviceId: config.deviceId,
    readings: { temperature: 25.0 },
    location: config.location
  });
  await client.disconnect();
})();
```

## Flutter SDK (Mobile)

### Features
- Auto-connects to C3 backend when user registers/logs in
- Wearables and mobile devices can auto-generate and retrieve API keys
- Simple onboarding for new devices (drones, SEH helmets, nodes, etc.)
- Unified device registration and management from the app
- Supports all C3 protocols (MQTT, HTTP, LoRaWAN, WebSocket)

### Installation

Add to your `pubspec.yaml`:
```yaml
dependencies:
  c3_sdk_flutter:
    git:
      url: https://github.com/hub-c3/c3-sdk-flutter.git
```

### Basic Usage

```dart
import 'package:c3_sdk_flutter/c3_sdk_flutter.dart';

void main() async {
  final c3 = C3Client();
  await c3.registerUser(email: 'user@email.com', password: 'password');
  // Auto-connects and retrieves API key
  final deviceKey = await c3.addDevice(
    type: DeviceType.drone,
    name: 'Drone D-001',
    location: LatLng(3.1390, 101.6869),
  );
  print('Device registered with API key: $deviceKey');
}
```

### Device Onboarding
- All device types (drones, SEH helmets, ground nodes, etc.) can be added from the app
- API keys are generated and managed automatically
- Devices appear in the dashboard instantly after registration

### API Key Management
- API keys are securely stored and can be rotated from the app
- Devices can request new keys if compromised

## Communication Protocols

* **MQTT**: Default for telemetry and alerts. Supports QoS 0/1 and TLS.
* **HTTP/REST**: Device management and bulk uploads.
* **WebSocket**: Real-time dashboards and mobile apps.
* **LoRaWAN/LoRa**: Low-bandwidth sensor uplinks. All SDKs support LoRa as a transport for telemetry and alerts.

## API Reference

### Authentication

`POST /api/v1/auth/login`

* **Request**: `{ "device_id": "...", "api_key": "..." }`
* **Response**: `{ "token": "...", "expires_in": 3600 }`

### Device Registration

`POST /api/v1/devices`

* **Request**: `DeviceConfig` JSON
* **Response**: `{ "status": "registered" }`

### Telemetry

`POST /api/v1/telemetry`

* **Request**: `SensorData` JSON
* **Response**: `{ "status": "ok" }`

### Alerts

`GET /api/v1/alerts?device_id=...`

* **Response**: Array of `Alert` objects

### Commands

`GET /api/v1/commands?device_id=...`

* **Response**: Array of command JSON

## Examples & Use Cases

1. **Environmental Station**: Continuous monitoring and anomaly alerts (WiFi, Cellular, or LoRa).
2. **Smart Helmet**: Early warnings via LoRa mesh and HUD display.
3. **Drone Fleet**: On-demand imaging and payload delivery (multi-transport).
4. **Mobile App**: Real-time alert subscription and SOS reporting.

## Troubleshooting

* **LoRa Connection Issues**: Ensure the correct serial port is specified and the LoRa module is connected. Check permissions for `/dev/ttyUSB0` or equivalent.
* **Connection Failures**: Check network and certificate validity.
* **Registration Errors**: Validate `DeviceConfig` schema.
* **Missing Telemetry**: Ensure correct topic format: `hub/telemetry/{device_id}`.
* **Latency Issues**: Use MQTT keepalive and adjust QoS.
* **Debugging**: Enable verbose logs:

  * Python: `logging.getLogger('hub_c3_sdk').setLevel(logging.DEBUG)`
  * Node.js: `DEBUG=hub-c3-sdk npm start`
  * C++: Define `ENABLE_MOSQUITTO_LOG` macro

## Backend API Key Management Service (C3)

A dedicated backend service is recommended for secure API key generation, device registration, and SDK integration. This service can be containerized (e.g., with Docker) for portability and scalability.

### Recommended Architecture
- **Service**: RESTful API (Node.js, Python FastAPI, or Go)
- **Responsibilities**:
  - Handle user/device registration and authentication
  - Generate, store, and rotate API keys
  - Integrate with all SDKs (Python, C++, Node.js, Flutter)
  - Provide endpoints for device onboarding and key management
- **Deployment**: Docker container (or serverless function if preferred)
- **Security**: Use environment variables for secrets, TLS for all endpoints

### Example Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Example FastAPI Endpoint (Python)
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import secrets

app = FastAPI()

class DeviceRegistration(BaseModel):
    device_type: str
    device_name: str
    user_id: str

@app.post("/register-device")
def register_device(reg: DeviceRegistration):
    api_key = secrets.token_urlsafe(32)
    # Store device and key in DB (not shown)
    return {"device_id": reg.device_name, "api_key": api_key}
```

### Notes
- You can deploy this service with Docker, Kubernetes, or serverless platforms
- The service can be extended to support OAuth, JWT, and integration with your main C3 backend
- All SDKs (including Flutter) should use this service for device onboarding and key management


