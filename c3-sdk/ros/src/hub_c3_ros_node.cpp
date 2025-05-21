#include <ros/ros.h>
#include <std_msgs/String.h>
#include <sensor_msgs/Imu.h>
#include <hub_c3_sdk/hub_client.hpp>
using namespace hub_c3_sdk;
class C3RosNode {
public:
    C3RosNode(ros::NodeHandle& nh) : nh_(nh), client_(DeviceConfig{"robot_001", "ros_robot", "api_key", {3.1390, 101.6869}, {"imu", "gps", "camera"}}) {
        imu_pub_ = nh_.advertise<sensor_msgs::Imu>("c3/telemetry/imu", 10);
        alert_sub_ = nh_.subscribe("c3/alerts/in", 10, &C3RosNode::rosAlertCallback, this);
        client_.set_alert_callback([this](const Alert& a){ this->onC3Alert(a); });
        client_.set_command_callback([this](const std::string& cmd){ this->onC3Command(cmd); });
        client_.connect();
        client_.register_device();
    }
    void spin() {
        ros::Rate rate(10);
        while (ros::ok()) {
            sensor_msgs::Imu imu_msg;
            imu_msg.header.stamp = ros::Time::now();
            imu_msg.header.frame_id = "base_link";
            imu_pub_.publish(imu_msg);
            ros::spinOnce();
            rate.sleep();
        }
    }
private:
    ros::NodeHandle& nh_;
    HubClient client_;
    ros::Publisher imu_pub_;
    ros::Subscriber alert_sub_;
    void onC3Alert(const Alert& alert) {
        std_msgs::String msg;
        msg.data = alert.message;
        ros::Publisher pub = nh_.advertise<std_msgs::String>("c3/alerts/out", 10);
        pub.publish(msg);
    }
    void onC3Command(const std::string& cmd) {
        ROS_INFO("Received C3 command: %s", cmd.c_str());
    }
    void rosAlertCallback(const std_msgs::String::ConstPtr& msg) {
        Alert alert;
        alert.id = "ros_alert";
        alert.type = "custom";
        alert.level = AlertLevel::LOW;
        alert.message = msg->data;
        alert.timestamp = ros::Time::now().toNSec() / 1000000ULL;
        client_.send_alert(alert);
    }
};
