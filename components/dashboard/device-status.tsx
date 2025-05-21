"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useEffect, useState } from "react"
import { getDeviceCountByStatus } from "@/lib/supabase-service"

export function DeviceStatus() {
  const [data, setData] = useState([
    { name: "Active", value: 0, color: "#22c55e" },
    { name: "Warning", value: 0, color: "#f59e0b" },
    { name: "Offline", value: 0, color: "#6b7280" },
    { name: "Alert", value: 0, color: "#ef4444" },
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusCounts = await getDeviceCountByStatus()

        const newData = [
          {
            name: "Active",
            value: statusCounts.find((s) => s.status === "active")?.count || 0,
            color: "#22c55e",
          },
          {
            name: "Warning",
            value: statusCounts.find((s) => s.status === "warning")?.count || 0,
            color: "#f59e0b",
          },
          {
            name: "Offline",
            value: statusCounts.find((s) => s.status === "offline")?.count || 0,
            color: "#6b7280",
          },
          {
            name: "Alert",
            value: statusCounts.find((s) => s.status === "alert")?.count || 0,
            color: "#ef4444",
          },
        ]

        setData(newData)
      } catch (error) {
        console.error("Error fetching device status data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
                        <span className="text-sm font-medium">{payload[0].name}</span>
                      </div>
                      <div className="text-right text-sm font-medium">{payload[0].value} devices</div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
