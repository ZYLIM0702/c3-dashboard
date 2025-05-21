"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for seismic activity over time
const seismicData = [
  { date: "2023-05-01", value: 0.2 },
  { date: "2023-05-02", value: 0.3 },
  { date: "2023-05-03", value: 0.2 },
  { date: "2023-05-04", value: 0.4 },
  { date: "2023-05-05", value: 0.6 },
  { date: "2023-05-06", value: 1.2 },
  { date: "2023-05-07", value: 2.5 },
  { date: "2023-05-08", value: 3.8 },
  { date: "2023-05-09", value: 2.1 },
  { date: "2023-05-10", value: 1.5 },
  { date: "2023-05-11", value: 0.8 },
  { date: "2023-05-12", value: 0.5 },
  { date: "2023-05-13", value: 0.3 },
  { date: "2023-05-14", value: 0.2 },
]

// Sample data for water levels over time
const waterData = [
  { date: "2023-05-01", value: 2.1 },
  { date: "2023-05-02", value: 2.2 },
  { date: "2023-05-03", value: 2.3 },
  { date: "2023-05-04", value: 2.5 },
  { date: "2023-05-05", value: 2.6 },
  { date: "2023-05-06", value: 3.1 },
  { date: "2023-05-07", value: 4.2 },
  { date: "2023-05-08", value: 5.3 },
  { date: "2023-05-09", value: 4.8 },
  { date: "2023-05-10", value: 4.2 },
  { date: "2023-05-11", value: 3.5 },
  { date: "2023-05-12", value: 3.0 },
  { date: "2023-05-13", value: 2.7 },
  { date: "2023-05-14", value: 2.5 },
]

// Sample data for device status distribution
const deviceStatusData = [
  { name: "Active", value: 112, color: "#22c55e" },
  { name: "Warning", value: 8, color: "#f59e0b" },
  { name: "Offline", value: 5, color: "#6b7280" },
  { name: "Critical", value: 3, color: "#ef4444" },
]

// Sample data for alert types
const alertTypeData = [
  { name: "Seismic", value: 12 },
  { name: "Flood", value: 8 },
  { name: "Battery", value: 15 },
  { name: "Connection", value: 7 },
  { name: "System", value: 5 },
]

// Sample data for device distribution by type
const deviceTypeData = [
  { name: "Ground Nodes", value: 42 },
  { name: "Marine Buoys", value: 24 },
  { name: "Wearables", value: 36 },
  { name: "Drones", value: 12 },
  { name: "Smart Helmets", value: 14 },
]

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Comprehensive analytics and insights for the HUB network</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="seismic">Seismic Activity</TabsTrigger>
          <TabsTrigger value="water">Water Levels</TabsTrigger>
          <TabsTrigger value="devices">Device Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Device Status Distribution</CardTitle>
                <CardDescription>Current status of all devices in the network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {deviceStatusData.map((entry, index) => (
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
                                    <div
                                      className="h-2 w-2 rounded-full"
                                      style={{ backgroundColor: payload[0].payload.color }}
                                    />
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Types</CardTitle>
                <CardDescription>Distribution of alerts by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={alertTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium">{label}</span>
                                  </div>
                                  <div className="text-right text-sm font-medium">{payload[0].value} alerts</div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>Distribution of devices by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deviceTypeData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium">{label}</span>
                                  </div>
                                  <div className="text-right text-sm font-medium">{payload[0].value} devices</div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Seismic Activity Trend</CardTitle>
                <CardDescription>Seismic readings over the past 14 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Seismic Activity",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={seismicData}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 10,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) =>
                            new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                          }
                          tickLine={false}
                          axisLine={false}
                          tickMargin={10}
                          className="text-xs"
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="value"
                          strokeWidth={2}
                          activeDot={{
                            r: 6,
                            className: "fill-primary stroke-background stroke-2",
                          }}
                          className="stroke-[--color-value]"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Water Level Trend</CardTitle>
                <CardDescription>Water level readings over the past 14 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Water Level",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={waterData}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 10,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) =>
                            new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                          }
                          tickLine={false}
                          axisLine={false}
                          tickMargin={10}
                          className="text-xs"
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="value"
                          strokeWidth={2}
                          activeDot={{
                            r: 6,
                            className: "fill-primary stroke-background stroke-2",
                          }}
                          className="stroke-[--color-value]"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seismic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Seismic Activity Analysis</CardTitle>
              <CardDescription>Comprehensive view of seismic readings across all ground nodes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    value: {
                      label: "Seismic Activity",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={seismicData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                        }
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        className="text-xs"
                      />
                      <YAxis tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        strokeWidth={2}
                        activeDot={{
                          r: 6,
                          className: "fill-primary stroke-background stroke-2",
                        }}
                        className="stroke-[--color-value]"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Water Level Analysis</CardTitle>
              <CardDescription>Comprehensive view of water level readings across all marine buoys</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    value: {
                      label: "Water Level",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={waterData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                        }
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        className="text-xs"
                      />
                      <YAxis tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        strokeWidth={2}
                        activeDot={{
                          r: 6,
                          className: "fill-primary stroke-background stroke-2",
                        }}
                        className="stroke-[--color-value]"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Status Distribution</CardTitle>
                <CardDescription>Current status of all devices in the network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {deviceStatusData.map((entry, index) => (
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
                                    <div
                                      className="h-2 w-2 rounded-full"
                                      style={{ backgroundColor: payload[0].payload.color }}
                                    />
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>Distribution of devices by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deviceTypeData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium">{label}</span>
                                  </div>
                                  <div className="text-right text-sm font-medium">{payload[0].value} devices</div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
