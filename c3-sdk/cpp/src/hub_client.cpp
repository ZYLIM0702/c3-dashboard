#include "hub_c3_sdk/hub_client.hpp"
#include "hub_c3_sdk/lora.hpp"
#include <iostream>
namespace hub_c3_sdk {
class HubClient::Impl {
public:
    DeviceConfig config;
    bool connected = false;
    AlertCallback alert_cb;
    CommandCallback cmd_cb;
    HubClient::Transport transport;
    std::unique_ptr<LoRaInterface> lora;
    Impl(const DeviceConfig& cfg, HubClient::Transport t, const std::string& lora_port)
        : config(cfg), transport(t) {
        if (transport == HubClient::Transport::LORA) {
            lora = std::make_unique<LoRaInterface>(lora_port);
        }
    }
    bool connect() {
        if (transport == HubClient::Transport::LORA && lora) {
            connected = lora->connect();
            return connected;
        }
        connected = true;
        return true;
    }
    void disconnect() {
        if (transport == HubClient::Transport::LORA && lora) lora->disconnect();
        connected = false;
    }
    bool is_connected() const { return connected; }
    bool register_device() { return true; }
    bool send_telemetry(const SensorData& data) {
        if (transport == HubClient::Transport::LORA && lora) {
            lora->send("telemetry");
            return true;
        }
        return true;
    }
    bool send_alert(const Alert& alert) {
        if (transport == HubClient::Transport::LORA && lora) {
            lora->send("alert");
            return true;
        }
        return true;
    }
    void set_alert_callback(AlertCallback cb) { alert_cb = cb; }
    void set_command_callback(CommandCallback cb) { cmd_cb = cb; }
};
HubClient::HubClient(const DeviceConfig& config, Transport transport, const std::string& lora_port)
    : pImpl(new Impl(config, transport, lora_port)), transport_(transport) {
    if (transport == Transport::LORA) lora_ = std::make_unique<LoRaInterface>(lora_port);
}
HubClient::~HubClient() = default;
bool HubClient::connect() { return pImpl->connect(); }
void HubClient::disconnect() { pImpl->disconnect(); }
bool HubClient::is_connected() const { return pImpl->is_connected(); }
bool HubClient::register_device() { return pImpl->register_device(); }
bool HubClient::send_telemetry(const SensorData& d) { return pImpl->send_telemetry(d); }
bool HubClient::send_alert(const Alert& a) { return pImpl->send_alert(a); }
void HubClient::set_alert_callback(AlertCallback cb) { pImpl->set_alert_callback(cb); }
void HubClient::set_command_callback(CommandCallback cb) { pImpl->set_command_callback(cb); }
} // namespace hub_c3_sdk
