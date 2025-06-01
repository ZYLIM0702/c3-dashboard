import 'dart:convert';
import 'package:http/http.dart' as http;

class C3Backend {
  final String baseUrl;
  String? apiKey;
  C3Backend({required this.baseUrl, this.apiKey});

  Future<bool> connect() async {
    // Simulate HTTP connect (could be WebSocket/MQTT in real impl)
    return true;
  }

  Future<void> sendData(Map<String, dynamic> data) async {
    await http.post(
      Uri.parse('$baseUrl/api/v1/telemetry'),
      headers: {'Authorization': 'Bearer $apiKey', 'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );
  }

  Stream<Map<String, dynamic>> streamData() async* {
    // Simulate streaming (replace with WebSocket/MQTT in real impl)
    yield* Stream.empty();
  }
}
