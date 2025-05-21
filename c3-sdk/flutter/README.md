# C3 Flutter SDK

A simple Flutter SDK for connecting mobile apps and wearables to the HUB C3 platform.

## Features
- Auto-connect to C3 backend on user registration/login
- Auto-generate and retrieve API keys for devices
- Simple onboarding for all device types (drones, SEH helmets, nodes, etc.)
- Unified device registration and management
- Supports MQTT, HTTP, LoRaWAN, WebSocket

## Installation
Add to your `pubspec.yaml`:
```yaml
dependencies:
  c3_sdk_flutter:
    git:
      url: https://github.com/hub-c3/c3-sdk-flutter.git
```

## Basic Usage
```dart
import 'package:c3_sdk_flutter/c3_sdk_flutter.dart';

void main() async {
  final c3 = C3Client();
  await c3.registerUser(email: 'user@email.com', password: 'password');
  final deviceKey = await c3.addDevice(
    type: DeviceType.drone,
    name: 'Drone D-001',
    location: LatLng(3.1390, 101.6869),
  );
  print('Device registered with API key: $deviceKey');
}
```

## Device Onboarding
- Add any device from the app
- API keys are managed automatically
- Devices appear in dashboard after registration

## API Key Management
- Keys are securely stored and can be rotated
- Devices can request new keys if compromised
