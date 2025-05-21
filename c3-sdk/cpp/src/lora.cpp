#include "hub_c3_sdk/lora.hpp"
#include <iostream>
namespace hub_c3_sdk {
LoRaInterface::LoRaInterface(const std::string& port, int baudrate)
    : port_(port), baudrate_(baudrate), connected_(false) {}
LoRaInterface::~LoRaInterface() { disconnect(); }
bool LoRaInterface::connect() {
    connected_ = true;
    return true;
}
bool LoRaInterface::send(const std::string& data) {
    if (!connected_) return false;
    std::cout << "[LoRa] Sending: " << data << std::endl;
    return true;
}
std::string LoRaInterface::receive() {
    return "";
}
void LoRaInterface::disconnect() {
    connected_ = false;
}
bool LoRaInterface::is_connected() const { return connected_; }
} // namespace hub_c3_sdk
