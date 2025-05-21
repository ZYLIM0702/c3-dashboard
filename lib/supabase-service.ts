import { createClient } from "@supabase/supabase-js"
import type { Device, Sensor, SensorReading, Alert, Event, User, Team, Deployment } from "./supabase-schema"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

// Devices
export async function getDevices() {
  const { data, error } = await supabase.from("devices").select("*")

  if (error) throw error
  return data as Device[]
}

export async function getDeviceById(id: string) {
  const { data, error } = await supabase.from("devices").select("*").eq("id", id).single()

  if (error) throw error
  return data as Device
}

export async function createDevice(device: Omit<Device, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("devices")
    .insert([{ ...device, created_at: new Date().toISOString() }])
    .select()

  if (error) throw error
  return data[0] as Device
}

export async function updateDevice(id: string, updates: Partial<Device>) {
  const { data, error } = await supabase.from("devices").update(updates).eq("id", id).select()

  if (error) throw error
  return data[0] as Device
}

export async function deleteDevice(id: string) {
  const { error } = await supabase.from("devices").delete().eq("id", id)

  if (error) throw error
  return true
}

// Sensors
export async function getSensors(deviceId?: string) {
  let query = supabase.from("sensors").select("*")

  if (deviceId) {
    query = query.eq("device_id", deviceId)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Sensor[]
}

// Sensor Readings
export async function getSensorReadings(sensorId: string, limit = 100) {
  const { data, error } = await supabase
    .from("sensor_readings")
    .select("*")
    .eq("sensor_id", sensorId)
    .order("timestamp", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as SensorReading[]
}

export async function createSensorReading(reading: Omit<SensorReading, "id">) {
  const { data, error } = await supabase.from("sensor_readings").insert([reading]).select()

  if (error) throw error
  return data[0] as SensorReading
}

// Alerts
export async function getAlerts(status?: Alert["status"]) {
  let query = supabase.from("alerts").select("*")

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data as Alert[]
}

export async function createAlert(alert: Omit<Alert, "id" | "created_at" | "updated_at">) {
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from("alerts")
    .insert([
      {
        ...alert,
        created_at: now,
        updated_at: now,
      },
    ])
    .select()

  if (error) throw error
  return data[0] as Alert
}

export async function updateAlert(id: string, updates: Partial<Alert>) {
  const { data, error } = await supabase
    .from("alerts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()

  if (error) throw error
  return data[0] as Alert
}

// Events
export async function getEvents(status?: Event["status"]) {
  let query = supabase.from("events").select("*")

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.order("started_at", { ascending: false })

  if (error) throw error
  return data as Event[]
}

export async function createEvent(event: Omit<Event, "id">) {
  const { data, error } = await supabase.from("events").insert([event]).select()

  if (error) throw error
  return data[0] as Event
}

export async function updateEvent(id: string, updates: Partial<Event>) {
  const { data, error } = await supabase.from("events").update(updates).eq("id", id).select()

  if (error) throw error
  return data[0] as Event
}

// Users
export async function getUsers() {
  const { data, error } = await supabase.from("users").select("*")

  if (error) throw error
  return data as User[]
}

// Teams
export async function getTeams() {
  const { data, error } = await supabase.from("teams").select("*")

  if (error) throw error
  return data as Team[]
}

// Deployments
export async function getDeployments(status?: Deployment["status"]) {
  let query = supabase.from("deployments").select("*")

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Deployment[]
}

export async function createDeployment(deployment: Omit<Deployment, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("deployments")
    .insert([{ ...deployment, created_at: new Date().toISOString() }])
    .select()

  if (error) throw error
  return data[0] as Deployment
}

export async function updateDeployment(id: string, updates: Partial<Deployment>) {
  const { data, error } = await supabase.from("deployments").update(updates).eq("id", id).select()

  if (error) throw error
  return data[0] as Deployment
}
