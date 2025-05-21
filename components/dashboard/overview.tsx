"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { getSensorReadings } from "@/lib/supabase-service"

// Sample data to use as fallback
const sampleData = [
  { time: "00:00", seismic: 0.2, water: 2.1, temperature: 24 },
  { time: "03:00", seismic: 0.3, water: 2.2, temperature: 23 },
  { time: "06:00", seismic: 0.2, water: 2.3, temperature: 22 },
  { time: "09:00", seismic: 0.4, water: 2.5, temperature: 25 },
  { time: "12:00", seismic: 0.6, water: 2.6, temperature: 27 },
  { time: "15:00", seismic: 1.2, water: 3.1, temperature: 28 },
  { time: "18:00", seismic: 2.5, water: 4.2, temperature: 26 },
  { time: "21:00", seismic: 3.8, water: 5.3, temperature: 25 },
  { time: "00:00", seismic: 2.1, water: 4.8, temperature: 24 },
]

export function Overview() {
  const [data, setData] = useState(sampleData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try to fetch data from the database
        // First, try to get all sensors to find valid sensor IDs
        const supabase = getSupabaseClient()
        const { data: sensors, error: sensorsError } = await supabase.from("sensors").select("id, type").limit(10)

        if (sensorsError) throw new Error("Error fetching sensors")

        if (!sensors || sensors.length < 3) {
          // Not enough sensors, use sample data
          console.log("Not enough sensors found, using sample data")
          setData(sampleData)
          return
        }

        // Find sensors by type
        const seismicSensor = sensors.find((s) => s.type === "seismic")?.id || sensors[0].id
        const waterSensor = sensors.find((s) => s.type === "water_level")?.id || sensors[1].id
        const tempSensor = sensors.find((s) => s.type === "temperature")?.id || sensors[2].id

        // Fetch readings for each sensor
        const [seismicReadings, waterReadings, tempReadings] = await Promise.all([
          getSensorReadings(seismicSensor, 24),
          getSensorReadings(waterSensor, 24),
          getSensorReadings(tempSensor, 24),
        ])

        // Check if we have enough data
        if (seismicReadings.length < 5 || waterReadings.length < 5 || tempReadings.length < 5) {
          console.log("Insufficient sensor readings, using sample data")
          setData(sampleData)
          return
        }

        // Process and combine the data
        const processedData = seismicReadings.map((reading, index) => {
          const time = new Date(reading.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          return {
            time,
            seismic: reading.value,
            water: waterReadings[index % waterReadings.length]?.value || 0,
            temperature: tempReadings[index % tempReadings.length]?.value || 0,
          }
        })

        setData(processedData.reverse())
      } catch (error) {
        console.error("Error fetching sensor data:", error)
        // Fallback to sample data on error
        setData(sampleData)
        setError("Could not fetch sensor data. Using sample data instead.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="h-[300px] flex items-center justify-center">Loading sensor data...</div>
  }

  return (
    <>
      {error && <div className="mb-4 text-sm text-muted-foreground">Note: {error}</div>}
      <ChartContainer
        config={{
          seismic: {
            label: "Seismic Activity",
            color: "hsl(var(--chart-1))",
          },
          water: {
            label: "Water Level",
            color: "hsl(var(--chart-2))",
          },
          temperature: {
            label: "Temperature",
            color: "hsl(var(--chart-3))",
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="seismic"
              strokeWidth={2}
              activeDot={{
                r: 6,
                className: "fill-primary stroke-background stroke-2",
              }}
              className="stroke-[--color-seismic]"
            />
            <Line
              type="monotone"
              dataKey="water"
              strokeWidth={2}
              activeDot={{
                r: 6,
                className: "fill-primary stroke-background stroke-2",
              }}
              className="stroke-[--color-water]"
            />
            <Line
              type="monotone"
              dataKey="temperature"
              strokeWidth={2}
              activeDot={{
                r: 6,
                className: "fill-primary stroke-background stroke-2",
              }}
              className="stroke-[--color-temperature]"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  )
}

// Helper function to get the Supabase client
import { getSupabaseClient } from "@/lib/supabase-service"
