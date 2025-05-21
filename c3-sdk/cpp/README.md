# HUB C3 C++ SDK

A C++ SDK for integrating embedded and high-performance devices with the HUB C3 platform.

## Features
- Device registration and telemetry
- LoRa, WiFi, Cellular, HTTP support
- Video stream registration and retrieval
- LoRa text messaging (chat)

## Build
```bash
cd c3-sdk/cpp
mkdir build && cd build
cmake ..
make -j4
sudo make install
```

## Usage Example
See `examples/environmental_station.cpp` for device integration.

## Video Streaming
See `include/hub_c3_sdk/video_stream.hpp` for video stream API.

## LoRa Messaging
Integrate with LoRa modules and use the SDK for messaging between nodes.
