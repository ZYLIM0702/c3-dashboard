#include <hub_c3_sdk/hub_client.hpp>
#include <iostream>
using namespace hub_c3_sdk;
int main() {
    DeviceConfig config{"env_station_kl_001", "environmental_station", "your_api_key_here", {3.1390, 101.6869}, {"temperature", "humidity", "co2", "seismometer"}};
    HubClient client(config);
    if (!client.connect()) { std::cerr << "Failed to connect" << std::endl; return 1; }
    client.register_device();
    SensorData data{"env_station_kl_001", 0, {}};
    client.send_telemetry(data);
    client.disconnect();
    return 0;
}
