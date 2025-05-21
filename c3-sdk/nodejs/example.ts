import { HubClient } from './src/client';
import { DeviceConfig } from './src/config';
(async () => {
  const config = new DeviceConfig({
    deviceId: 'env_station_kl_001',
    deviceType: 'environmental_station',
    apiKey: 'your_api_key_here',
    location: { lat: 3.1390, lon: 101.6869 },
    capabilities: ['temperature', 'humidity', 'co2', 'seismometer']
  });
  const client = new HubClient({ endpoint: 'https://api.hub-c3.org', deviceConfig: config });
  await client.connect();
  await client.registerDevice();
  await client.sendTelemetry({ timestamp: Date.now(), deviceId: config.deviceId, readings: { temperature: 25.0 }, location: config.location });
})();
