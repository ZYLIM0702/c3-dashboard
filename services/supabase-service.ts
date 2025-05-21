import { createClient } from "@supabase/supabase-js"

export class SupabaseService {
  private supabase

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    )
  }

  // Get all devices
  async getDevices() {
    try {
      const { data, error } = await this.supabase.from("devices").select("*")

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching devices:", error)
      throw error
    }
  }

  // Get devices by type - Adding this missing method
  async getDevicesByType(type: string) {
    try {
      const { data, error } = await this.supabase.from("devices").select("*").eq("type", type)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error(`Error fetching devices of type ${type}:`, error)
      throw error
    }
  }

  // Existing methods...

  // New methods for the added pages
  async getAlerts() {
    try {
      const { data, error } = await this.supabase.from("alerts").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching alerts:", error)
      throw error
    }
  }

  async updateAlertStatus(id: string, status: string) {
    try {
      const { data, error } = await this.supabase
        .from("alerts")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating alert status:", error)
      throw error
    }
  }

  async getEvents() {
    try {
      const { data, error } = await this.supabase.from("events").select("*").order("started_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching events:", error)
      throw error
    }
  }

  async getTeams() {
    try {
      const { data, error } = await this.supabase
        .from("teams")
        .select(`
          *,
          leader:leader_id(name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Format the data to include leader_name
      return (data || []).map((team) => ({
        ...team,
        leader_name: team.leader?.name,
      }))
    } catch (error) {
      console.error("Error fetching teams:", error)
      throw error
    }
  }

  async getDeployments() {
    try {
      const { data, error } = await this.supabase
        .from("deployments")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching deployments:", error)
      throw error
    }
  }
}
