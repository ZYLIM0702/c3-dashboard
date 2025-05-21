"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { getSensorReadings } from "@/lib/supabase-service"

export function Overview() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use valid UUID format for sensor IDs
        // Fetch seismic data from Ground Node G-001
        const seismicReadings = await getSensorReadings("00000000-0000-0000-0000-000000000001", 24)

        // Fetch water level data from Marine Buoy M-002
        const waterReadings = await getSensorReadings("00000000-0000-0000-0000-000000000002", 24)

        // Fetch temperature data from Ground Node G-001
        const tempReadings = await getSensorReadings("00000000-0000-0000-0000-000000000003", 24)

        // If we don't have enough data, use sample data
        if (seismicReadings.length === 0 || waterReadings.length === 0 || tempReadings.length === 0) {
          throw new Error("Insufficient sensor data")
        }

        // Process and combine the data
        const processedData = seismicReadings.map((reading, index) => {
          const time = new Date(reading.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          return {
            time,
            seismic: reading.value,
            water: waterReadings[index]?.value || 0,
            temperature: tempReadings[index]?.value || 0,
          }
        })

        setData(processedData.reverse())
      } catch (error) {
        console.error("Error fetching sensor data:", error)
        // Fallback to sample data if there's an error
        setData([
          { time: "00:00", seismic: 0.2, water: 2.1, temperature: 24 },
          { time: "03:00", seismic: 0.3, water: 2.2, temperature: 23 },
          { time: "06:00", seismic: 0.2, water: 2.3, temperature: 22 },
          { time: "09:00", seismic: 0.4, water: 2.5, temperature: 25 },
          { time: "12:00", seismic: 0.6, water: 2.6, temperature: 27 },
          { time: "15:00", seismic: 1.2, water: 3.1, temperature: 28 },
          { time: "18:00", seismic: 2.5, water: 4.2, temperature: 26 },
          { time: "21:00", seismic: 3.8, water: 5.3, temperature: 25 },
          { time: "00:00", seismic: 2.1, water: 4.8, temperature: 24 },
        ])
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
  )
}
