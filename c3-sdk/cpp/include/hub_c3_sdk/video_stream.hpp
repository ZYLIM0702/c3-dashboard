#ifndef HUB_C3_SDK_VIDEO_STREAM_HPP
#define HUB_C3_SDK_VIDEO_STREAM_HPP
#include <string>
#include <vector>
namespace hub_c3_sdk {
class VideoStreamClient {
public:
    VideoStreamClient(const std::string& backend_url, const std::string& api_key = "");
    std::string register_stream(const std::string& device_id, const std::string& stream_url, const std::string& stream_type);
    std::vector<std::string> list_streams();
    std::string get_stream_url(const std::string& device_id);
private:
    std::string backend_url_;
    std::string api_key_;
};
}
#endif
