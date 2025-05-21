export class DeviceConfig {
  deviceId: string;
  deviceType: string;
  apiKey: string;
  location: { lat: number; lon: number };
  capabilities: string[];
  constructor(opts: {
    deviceId: string;
    deviceType: string;
    apiKey: string;
    location: { lat: number; lon: number };
    capabilities: string[];
  }) {
    this.deviceId = opts.deviceId;
    this.deviceType = opts.deviceType;
    this.apiKey = opts.apiKey;
    this.location = opts.location;
    this.capabilities = opts.capabilities;
  }
}
