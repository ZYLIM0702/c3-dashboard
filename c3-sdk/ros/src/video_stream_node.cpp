#include <ros/ros.h>
#include <std_msgs/String.h>
#include <hub_c3_sdk/video_stream.hpp>
using namespace hub_c3_sdk;
int main(int argc, char** argv) {
    ros::init(argc, argv, "video_stream_node");
    ros::NodeHandle nh;
    VideoStreamClient client("http://localhost:8000");
    // Example: register a stream
    client.register_stream("device_id", "rtsp://example.com/stream", "rtsp");
    // Example: list streams
    auto streams = client.list_streams();
    for (const auto& s : streams) ROS_INFO("Stream: %s", s.c_str());
    // Example: get stream url
    auto url = client.get_stream_url("device_id");
    ROS_INFO("Stream URL: %s", url.c_str());
    ros::spin();
    return 0;
}
