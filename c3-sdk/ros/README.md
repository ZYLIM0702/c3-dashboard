# HUB C3 ROS SDK

A ROS package for integrating robots and sensors with the HUB C3 platform.

## Features
- ROS node for device registration, telemetry, and alerts
- LoRa, WiFi, Cellular, HTTP support
- Video stream registration and retrieval
- LoRa text messaging (chat)

## Build
```bash
cd c3-sdk/ros
catkin_make
source devel/setup.bash
```

## Usage Example
```bash
rosrun c3_ros_node c3_ros_node_main
```

## Video Streaming
See `src/video_stream_node.cpp` for video stream integration.

## LoRa Messaging
Extend the node to support LoRa chat between robots/nodes.
