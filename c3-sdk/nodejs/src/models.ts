export enum AlertLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4
}
export interface SensorData {
  timestamp: number;
  deviceId: string;
  readings: Record<string, any>;
  location: { lat: number; lon: number };
}
