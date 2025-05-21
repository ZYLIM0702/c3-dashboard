#ifndef HUB_C3_SDK_HUB_CLIENT_HPP
#define HUB_C3_SDK_HUB_CLIENT_HPP
#include <string>
#include <vector>
#include <functional>
#include <memory>
#include "hub_c3_sdk/lora.hpp"
namespace hub_c3_sdk {
struct DeviceConfig {
    std::string device_id;
    std::string device_type;
    std::string api_key;
    struct { double lat, lon; } location;
    std::vector<std::string> capabilities;
};
struct SensorReading {
    std::string sensor_type;
    double value;
    std::string unit;
    uint64_t timestamp;
};
struct SensorData {
    std::string device_id;
    uint64_t timestamp;
    std::vector<SensorReading> readings;
};
enum class AlertLevel { LOW = 1, MEDIUM, HIGH, CRITICAL };
struct Alert {
    std::string id;
    std::string type;
    AlertLevel level;
    std::string message;
    uint64_t timestamp;
};
class HubClient {
public:
    enum class Transport { WIFI, CELLULAR, LORA };
    using AlertCallback = std::function<void(const Alert&)>;
    using CommandCallback = std::function<void(const std::string&)>;
    HubClient(const DeviceConfig& config, Transport transport = Transport::WIFI, const std::string& lora_port = "/dev/ttyUSB0");
    ~HubClient();
    bool connect();
    void disconnect();
    bool is_connected() const;
    bool register_device();
    bool send_telemetry(const SensorData& data);
    bool send_alert(const Alert& alert);
    void set_alert_callback(AlertCallback cb);
    void set_command_callback(CommandCallback cb);
private:
    class Impl;
    std::unique_ptr<Impl> pImpl;
    Transport transport_;
    std::unique_ptr<LoRaInterface> lora_;
};
} // namespace hub_c3_sdk
#endif
