// LoRa communication abstraction for Node.js SDK
export class LoRaInterface {
  port: string;
  baudrate: number;
  connected: boolean = false;
  constructor(port = '/dev/ttyUSB0', baudrate = 9600) {
    this.port = port;
    this.baudrate = baudrate;
  }
  connect() {
    this.connected = true;
  }
  send(data: Buffer) {
    if (!this.connected) throw new Error('LoRa not connected');
    console.log('[LoRa] Sending:', data);
  }
  receive(): Buffer {
    return Buffer.from('');
  }
  disconnect() {
    this.connected = false;
  }
}
