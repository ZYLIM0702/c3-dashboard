#ifndef HUB_C3_SDK_LORA_HPP
#define HUB_C3_SDK_LORA_HPP
#include <string>
namespace hub_c3_sdk {
class LoRaInterface {
public:
    LoRaInterface(const std::string& port = "/dev/ttyUSB0", int baudrate = 9600);
    ~LoRaInterface();
    bool connect();
    bool send(const std::string& data);
    std::string receive();
    void disconnect();
    bool is_connected() const;
private:
    std::string port_;
    int baudrate_;
    bool connected_ = false;
};
}
#endif
