import 'dart:math';

class ApiKeyManager {
  Future<String> generateApiKey() async {
    // Simulate secure API key generation
    final rand = Random();
    return List.generate(32, (_) => rand.nextInt(16).toRadixString(16)).join();
  }
}
