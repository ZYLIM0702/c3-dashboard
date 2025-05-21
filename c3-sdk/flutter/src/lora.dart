class LoRaWAN {
  bool connected = false;
  final List<String> _inbox = [];

  Future<void> connect() async {
    // Simulate LoRaWAN connect
    connected = true;
  }

  Future<void> sendData(List<int> data) async {
    // Simulate LoRaWAN send
  }

  Future<List<int>> receiveData() async {
    // Simulate LoRaWAN receive
    return [];
  }

  // --- Text Messaging for Chat ---
  Future<void> sendTextMessage(String toNodeId, String message) async {
    // Simulate sending a text message to another LoRa node
    // In real implementation, encode and send via LoRa
    print('[LoRa] Sent to $toNodeId: $message');
  }

  Future<List<String>> receiveTextMessages() async {
    // Simulate receiving text messages
    // In real implementation, decode received LoRa packets
    return _inbox;
  }

  // For simulation/testing: add a message to inbox
  void _simulateIncomingMessage(String fromNodeId, String message) {
    _inbox.add('From $fromNodeId: $message');
  }
}
