import { createClient } from "@supabase/supabase-js"
import type { Device, Sensor, SensorReading, Alert, Event, User, Team, Deployment } from "./supabase-schema"

// Create a singleton instance of the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a single instance for the client side
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// Server-side client with service role for admin operations
export const getServerSupabaseClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Devices
export async function getDevices() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("devices").select("*")

  if (error) throw error
  return data as Device[]
}

export async function getDeviceById(id: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("devices").select("*").eq("id", id).single()

  if (error) throw error
  return data as Device
}

export async function getDevicesByType(type: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("devices").select("*").eq("type", type)

  if (error) throw error
  return data as Device[]
}

export async function getDeviceCount() {
  const supabase = getSupabaseClient()
  const { count, error } = await supabase.from("devices").select("*", { count: "exact", head: true })

  if (error) throw error
  return count || 0
}

export async function getDeviceCountByType() {
  // Using a direct query instead of group by
  const supabase = getSupabaseClient()

  // Get all devices first
  const { data, error } = await supabase.from("devices").select("type")

  if (error) throw error

  // Count manually in JavaScript
  const counts: Record<string, number> = {}
  data.forEach((device) => {
    const type = device.type
    counts[type] = (counts[type] || 0) + 1
  })

  // Convert to array format
  return Object.entries(counts).map(([type, count]) => ({
    type,
    count,
  }))
}

export async function getDeviceCountByStatus() {
  // Using a direct query instead of group by
  const supabase = getSupabaseClient()

  // Get all devices first
  const { data, error } = await supabase.from("devices").select("status")

  if (error) throw error

  // Count manually in JavaScript
  const counts: Record<string, number> = {}
  data.forEach((device) => {
    const status = device.status
    counts[status] = (counts[status] || 0) + 1
  })

  // Convert to array format
  return Object.entries(counts).map(([status, count]) => ({
    status,
    count,
  }))
}

export async function createDevice(device: Omit<Device, "id" | "created_at">) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("devices")
    .insert([{ ...device, created_at: new Date().toISOString() }])
    .select()

  if (error) throw error
  return data[0] as Device
}

export async function updateDevice(id: string, updates: Partial<Device>) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("devices").update(updates).eq("id", id).select()

  if (error) throw error
  return data[0] as Device
}

export async function deleteDevice(id: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("devices").delete().eq("id", id)

  if (error) throw error
  return true
}

// Sensors
export async function getSensors(deviceId?: string) {
  const supabase = getSupabaseClient()
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
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("sensor_readings")
      .select("*")
      .eq("sensor_id", sensorId)
      .order("timestamp", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error(`Error fetching sensor readings for sensor ${sensorId}:`, error)
    return [] // Return empty array instead of throwing
  }
}

export async function createSensorReading(reading: Omit<SensorReading, "id">) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("sensor_readings").insert([reading]).select()

  if (error) throw error
  return data[0] as SensorReading
}

// Alerts
export async function getAlerts(status?: Alert["status"], limit = 10) {
  const supabase = getSupabaseClient()
  let query = supabase.from("alerts").select("*")

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.order("created_at", { ascending: false }).limit(limit)

  if (error) throw error
  return data as Alert[]
}

export async function getActiveAlertsCount() {
  const supabase = getSupabaseClient()
  const { count, error } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  if (error) throw error
  return count || 0
}

export async function getAlertCountBySeverity() {
  // Using a direct query instead of group by
  const supabase = getSupabaseClient()

  // Get all active alerts first
  const { data, error } = await supabase.from("alerts").select("severity").eq("status", "active")

  if (error) throw error

  // Count manually in JavaScript
  const counts: Record<string, number> = {}
  data.forEach((alert) => {
    const severity = alert.severity
    counts[severity] = (counts[severity] || 0) + 1
  })

  // Convert to array format
  return Object.entries(counts).map(([severity, count]) => ({
    severity,
    count,
  }))
}

export async function createAlert(alert: Omit<Alert, "id" | "created_at" | "updated_at">) {
  const supabase = getSupabaseClient()
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
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("alerts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()

  if (error) throw error
  return data[0] as Alert
}

// Events
export async function getEvents(status?: Event["status"], limit = 10) {
  const supabase = getSupabaseClient()
  let query = supabase.from("events").select("*")

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.order("started_at", { ascending: false }).limit(limit)

  if (error) throw error
  return data as Event[]
}

export async function getEventCountByType() {
  // Using a direct query instead of group by
  const supabase = getSupabaseClient()

  // Get all events first
  const { data, error } = await supabase.from("events").select("type")

  if (error) throw error

  // Count manually in JavaScript
  const counts: Record<string, number> = {}
  data.forEach((event) => {
    const type = event.type
    counts[type] = (counts[type] || 0) + 1
  })

  // Convert to array format
  return Object.entries(counts).map(([type, count]) => ({
    type,
    count,
  }))
}

export async function createEvent(event: Omit<Event, "id">) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("events").insert([event]).select()

  if (error) throw error
  return data[0] as Event
}

export async function updateEvent(id: string, updates: Partial<Event>) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("events").update(updates).eq("id", id).select()

  if (error) throw error
  return data[0] as Event
}

// Users
export async function getUsers() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("users").select("*")

  if (error) throw error
  return data as User[]
}

// Teams
export async function getTeams() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("teams").select("*")

  if (error) throw error
  return data as Team[]
}

export async function updateTeam(id: string, updates: Partial<Team>) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("teams").update(updates).eq("id", id).select()
  if (error) throw error
  return data[0] as Team
}

export async function deleteTeam(id: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("teams").delete().eq("id", id)
  if (error) throw error
  return true
}

// Deployments
export async function getDeployments(status?: Deployment["status"]) {
  const supabase = getSupabaseClient()
  let query = supabase.from("deployments").select("*")

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Deployment[]
}

export async function createDeployment(deployment: Omit<Deployment, "id" | "created_at">) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("deployments")
    .insert([{ ...deployment, created_at: new Date().toISOString() }])
    .select()

  if (error) throw error
  return data[0] as Deployment
}

export async function updateDeployment(id: string, updates: Partial<Deployment>) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("deployments").update(updates).eq("id", id).select()

  if (error) throw error
  return data[0] as Deployment
}
