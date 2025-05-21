import 'device.dart';
import 'api_key_manager.dart';
import 'c3_backend.dart';
import 'lora.dart';
import 'wifi_node.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class C3Client {
  final ApiKeyManager _keyManager = ApiKeyManager();
  String? userToken;
  C3Backend? backend;
  LoRaWAN? lora;
  WifiNode? wifiNode;

  Future<void> registerUser({required String email, required String password}) async {
    // Simulate registration and auto-connect
    userToken = 'mock_token';
    backend = C3Backend(baseUrl: 'https://api.hub-c3.org', apiKey: userToken);
    lora = LoRaWAN();
    wifiNode = WifiNode();
  }

  Future<String> addDevice({required DeviceType type, required String name, required LatLng location}) async {
    // Simulate device registration and API key retrieval
    final apiKey = await _keyManager.generateApiKey();
    // Register device in backend (mock)
    return apiKey;
  }

  Future<void> connectToC3() async {
    await backend?.connect();
  }

  Future<void> sendDataToC3(Map<String, dynamic> data) async {
    await backend?.sendData(data);
  }

  Future<void> connectToLoRaWAN() async {
    await lora?.connect();
  }

  Future<void> sendDataViaLoRaWAN(List<int> data) async {
    await lora?.sendData(data);
  }

  Future<void> connectToNodeWifi(String ssid, String password) async {
    await wifiNode?.connectToNode(ssid, password);
  }

  Future<void> sendToNode(Map<String, dynamic> data) async {
    await wifiNode?.sendToNode(data);
  }

  Future<void> relayDataViaLoRaWAN(List<int> data) async {
    await wifiNode?.relayViaLoRaWAN(data);
  }

  Future<void> registerVideoStream({required String deviceId, required String streamUrl, required String streamType}) async {
    // Register video stream with backend
    await http.post(
      Uri.parse('https://api.hub-c3.org/video/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'device_id': deviceId,
        'stream_url': streamUrl,
        'stream_type': streamType,
      }),
    );
  }

  Future<List<Map<String, dynamic>>> listVideoStreams() async {
    final resp = await http.get(Uri.parse('https://api.hub-c3.org/video/streams'));
    if (resp.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(resp.body));
    }
    return [];
  }

  Future<Map<String, dynamic>?> getVideoStreamUrl(String deviceId) async {
    final resp = await http.get(Uri.parse('https://api.hub-c3.org/video/stream-proxy/$deviceId'));
    if (resp.statusCode == 200) {
      return jsonDecode(resp.body);
    }
    return null;
  }
}
