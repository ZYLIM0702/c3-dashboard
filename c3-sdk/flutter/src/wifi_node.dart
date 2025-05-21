class WifiNode {
  bool connected = false;
  Future<void> connectToNode(String ssid, String password) async {
    // Simulate WiFi connect
    connected = true;
  }
  Future<void> sendToNode(Map<String, dynamic> data) async {
    // Simulate sending data to node over WiFi
  }
  Future<void> relayViaLoRaWAN(List<int> data) async {
    // Simulate relaying data to other node via LoRaWAN
  }
}
