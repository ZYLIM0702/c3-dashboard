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

  async getAlertById(id: string) {
    try {
      const { data, error } = await this.supabase
        .from("alerts")
        .select("*")
        .eq("id", id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching alert by id:", error)
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

  async getTeamById(id: string) {
    try {
      const { data, error } = await this.supabase
        .from("teams")
        .select(`*, leader:leader_id(name)`)
        .eq("id", id)
        .single();
      if (error) throw error;
      return {
        ...data,
        leader_name: data?.leader?.name,
      };
    } catch (error) {
      console.error("Error fetching team by id:", error);
      throw error;
    }
  }

  async updateTeam(id: string, updates: Partial<{ name: string; description?: string; leader_id?: string; members?: string[] }>) {
    try {
      const { data, error } = await this.supabase
        .from("teams")
        .update(updates)
        .eq("id", id)
        .select()
      if (error) throw error
      return data?.[0] || null
    } catch (error) {
      console.error("Error updating team:", error)
      throw error
    }
  }

  async deleteTeam(id: string) {
    try {
      const { error } = await this.supabase
        .from("teams")
        .delete()
        .eq("id", id)
      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting team:", error)
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

  // Telemetry methods
  async getTelemetry() {
    try {
      const { data, error } = await this.supabase
        .from("telemetry")
        .select("*")
        .order("timestamp", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching telemetry:", error);
      throw error;
    }
  }

  async getTelemetryByDeviceId(device_id: string) {
    try {
      const { data, error } = await this.supabase
        .from("telemetry")
        .select("*")
        .eq("device_id", device_id)
        .order("timestamp", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching telemetry by device_id:", error);
      throw error;
    }
  }

  async insertTelemetry(payload: Record<string, any>) {
    try {
      const { data, error } = await this.supabase
        .from("telemetry")
        .insert([payload])
        .select();
      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error("Error inserting telemetry:", error);
      throw error;
    }
  }

  // Commands methods
  async getCommands() {
    try {
      const { data, error } = await this.supabase
        .from("commands")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching commands:", error);
      throw error;
    }
  }

  async getCommandById(id: string) {
    try {
      const { data, error } = await this.supabase
        .from("commands")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching command by id:", error);
      throw error;
    }
  }

  async insertCommand(payload: Record<string, any>) {
    try {
      const { data, error } = await this.supabase
        .from("commands")
        .insert([payload])
        .select();
      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error("Error inserting command:", error);
      throw error;
    }
  }

  async updateCommandStatus(id: string, status: string) {
    try {
      const { data, error } = await this.supabase
        .from("commands")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select();
      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error("Error updating command status:", error);
      throw error;
    }
  }
}

// Helper function to upload a video file to Supabase
export async function uploadVideoToSupabase(file: File): Promise<string> {
  const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

  const filename = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from("video").upload(filename, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });
  if (error) throw error;

  const { data: publicUrlData } = supabase.storage.from("video").getPublicUrl(filename);
  if (!publicUrlData?.publicUrl) throw new Error("Failed to get public URL");
  return publicUrlData.publicUrl;
}
