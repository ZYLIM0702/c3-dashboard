import { DeviceConfig } from './config';
import { SensorData, AlertLevel } from './models';
import EventEmitter from 'events';
import { LoRaInterface } from './lora';

export class HubClient extends EventEmitter {
  endpoint: string;
  deviceConfig: DeviceConfig;
  tls: boolean;
  connected: boolean = false;
  transport: 'wifi' | 'cellular' | 'lora';
  lora?: LoRaInterface;

  constructor(opts: { endpoint: string; deviceConfig: DeviceConfig; tls?: boolean; transport?: 'wifi' | 'cellular' | 'lora'; loraPort?: string }) {
    super();
    this.endpoint = opts.endpoint;
    this.deviceConfig = opts.deviceConfig;
    this.tls = opts.tls ?? true;
    this.transport = opts.transport ?? 'wifi';
    if (this.transport === 'lora') {
      this.lora = new LoRaInterface(opts.loraPort);
    }
  }

  async connect() {
    if (this.transport === 'lora' && this.lora) {
      this.lora.connect();
      this.connected = this.lora.connected;
    } else {
      this.connected = true;
    }
    this.emit('connect');
  }

  isConnected() {
    return this.connected;
  }

  async registerDevice() {
    return { status: 'registered', deviceId: this.deviceConfig.deviceId };
  }

  async sendTelemetry(data: SensorData) {
    if (this.transport === 'lora' && this.lora) {
      this.lora.send(Buffer.from(JSON.stringify(data)));
      return { status: 'ok', via: 'lora' };
    }
    return { status: 'ok', via: 'wifi' };
  }

  async sendAlert(alert: any) {
    if (this.transport === 'lora' && this.lora) {
      this.lora.send(Buffer.from(JSON.stringify(alert)));
      return { status: 'alert_sent', via: 'lora' };
    }
    return { status: 'alert_sent', via: 'wifi' };
  }

  async sendCommand(cmd: any) {
    return { status: 'command_sent' };
  }

  async createStream() {
    return {
      send: async (data: SensorData) => ({ status: 'ok' })
    };
  }
}
