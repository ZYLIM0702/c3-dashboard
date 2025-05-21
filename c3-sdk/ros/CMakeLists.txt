cmake_minimum_required(VERSION 3.10)
project(hub_c3_ros)
find_package(catkin REQUIRED COMPONENTS roscpp std_msgs sensor_msgs)
catkin_package(
  INCLUDE_DIRS include
  LIBRARIES hub_c3_sdk hub_c3_ros
  CATKIN_DEPENDS roscpp std_msgs sensor_msgs
)
include_directories(include ${catkin_INCLUDE_DIRS} ../cpp/include)
add_library(hub_c3_ros src/hub_c3_ros_node.cpp)
target_link_libraries(hub_c3_ros hub_c3_sdk ${catkin_LIBRARIES})
add_executable(c3_ros_node src/c3_ros_node_main.cpp)
target_link_libraries(c3_ros_node hub_c3_ros ${catkin_LIBRARIES})
