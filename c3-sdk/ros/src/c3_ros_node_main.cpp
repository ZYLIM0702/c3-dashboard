#include <ros/ros.h>
#include "hub_c3_ros_node.cpp"
int main(int argc, char** argv) {
    ros::init(argc, argv, "c3_ros_node");
    ros::NodeHandle nh("~");
    C3RosNode node(nh);
    node.spin();
    return 0;
}
