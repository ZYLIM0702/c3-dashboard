// This file defines the database schema for the C3 Dashboard

export type DeviceType = "ground_node" | "marine_buoy" | "wearable" | "drone" | "seh" | "lora_module"
export type DeviceStatus = "active" | "inactive" | "maintenance" | "offline" | "alert"
export type AlertSeverity = "info" | "warning" | "critical" | "emergency"
export type AlertStatus = "active" | "acknowledged" | "resolved"
export type EventType = "earthquake" | "flood" | "system" | "device" | "user"

// Database Types
export interface Device {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  location: {
    latitude: number
    longitude: number
    altitude?: number
  }
  battery_level?: number
  signal_strength?: number
  firmware_version?: string
  last_seen: string // ISO date string
  created_at: string // ISO date string
  metadata: Record<string, any>
}

export interface Sensor {
  id: string
  device_id: string
  name: string
  type: string
  unit: string
  last_reading: number
  last_reading_time: string // ISO date string
  status: "active" | "inactive" | "error"
  metadata: Record<string, any>
}

export interface SensorReading {
  id: string
  sensor_id: string
  device_id: string
  value: number
  timestamp: string // ISO date string
  metadata: Record<string, any>
}

export interface Alert {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  status: AlertStatus
  source: {
    type: "device" | "system" | "user"
    id?: string
  }
  location?: {
    latitude: number
    longitude: number
  }
  created_at: string // ISO date string
  updated_at: string // ISO date string
  acknowledged_by?: string // user_id
  resolved_by?: string // user_id
  metadata: Record<string, any>
}

export interface Event {
  id: string
  type: EventType
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  location?: {
    latitude: number
    longitude: number
  }
  started_at: string // ISO date string
  ended_at?: string // ISO date string
  status: "active" | "resolved"
  metadata: Record<string, any>
}

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "operator" | "observer"
  last_login: string // ISO date string
  created_at: string // ISO date string
}

export interface Team {
  id: string
  name: string
  description?: string
  leader_id: string // user_id
  members: string[] // array of user_ids
  created_at: string // ISO date string
}

export interface Deployment {
  id: string
  name: string
  description?: string
  location: {
    latitude: number
    longitude: number
    radius?: number // in meters
  }
  devices: string[] // array of device_ids
  teams: string[] // array of team_ids
  start_date: string // ISO date string
  end_date?: string // ISO date string
  status: "planned" | "active" | "completed"
  created_at: string // ISO date string
  created_by: string // user_id
}
