import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  ArrowUpRight,
  Battery,
  Cpu,
  LifeBuoy,
  Radio,
  Signal,
  Smartphone,
  Waves,
  Wind,
} from "lucide-react"
import { Overview } from "@/components/dashboard/overview"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { DeviceStatus } from "@/components/dashboard/device-status"
import { EventTimeline } from "@/components/dashboard/event-timeline"
import {
  getActiveAlertsCount,
  getAlerts,
  getDeviceCount,
  getDeviceCountByStatus,
  getDeviceCountByType,
} from "@/lib/supabase-service"

export default async function DashboardPage() {
  // Fetch data from Supabase
  const totalDevices = await getDeviceCount()
  const activeAlerts = await getActiveAlertsCount()
  const criticalAlerts = await getAlerts("active", 3)
  const devicesByType = await getDeviceCountByType()
  const devicesByStatus = await getDeviceCountByStatus()

  // Calculate system health percentage
  const totalActiveDevices = devicesByStatus.find((d) => d.status === "active")?.count || 0
  const systemHealth = Math.round((totalActiveDevices / totalDevices) * 100)

  // Calculate average battery level (this would normally come from a more complex query)
  const avgBatteryLevel = 85 // Placeholder - would be calculated from actual device data

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Command & Control Center for Humanitarian Unified Backbone (HUB)</p>
      </div>

      {criticalAlerts.length > 0 && criticalAlerts[0].severity === "critical" && (
        <Alert variant="destructive" className="border-red-600">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{criticalAlerts[0].title}</AlertTitle>
          <AlertDescription>
            {criticalAlerts[0].description}
            <Button variant="link" className="h-auto p-0 ml-2">
              View details
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDevices}</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">
                {criticalAlerts.filter((a) => a.severity === "critical").length} critical
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth}%</div>
            <p className="text-xs text-muted-foreground">{totalDevices - totalActiveDevices} devices need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery Status</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgBatteryLevel}%</div>
            <p className="text-xs text-muted-foreground">Average across all devices</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Sensor readings and system metrics over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest alerts from all devices</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentAlerts />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Device Status</CardTitle>
                <CardDescription>Current status of all devices by type</CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceStatus />
              </CardContent>
            </Card>
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Event Timeline</CardTitle>
                <CardDescription>Recent events and system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <EventTimeline />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Manage and respond to current alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            alert.severity === "critical"
                              ? "destructive"
                              : alert.severity === "warning"
                                ? "warning"
                                : "outline"
                          }
                        >
                          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                        </Badge>
                        <h3 className="font-semibold">{alert.title}</h3>
                      </div>
                      <Button size="sm" variant="outline">
                        Acknowledge
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{alert.description}</p>
                    <div className="mt-2 flex items-center text-xs text-muted-foreground">
                      <span>{new Date(alert.created_at).toRelativeTime()}</span>
                      <span className="mx-2">•</span>
                      <span>Device ID: {alert.source.id || "System"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {devicesByType.map((deviceType) => {
              const icon =
                deviceType.type === "ground_node" ? (
                  <Radio className="h-4 w-4 text-muted-foreground" />
                ) : deviceType.type === "marine_buoy" ? (
                  <Waves className="h-4 w-4 text-muted-foreground" />
                ) : deviceType.type === "wearable" ? (
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                ) : deviceType.type === "drone" ? (
                  <Wind className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <LifeBuoy className="h-4 w-4 text-muted-foreground" />
                )

              const label =
                deviceType.type === "ground_node"
                  ? "Ground Nodes"
                  : deviceType.type === "marine_buoy"
                    ? "Marine Buoys"
                    : deviceType.type === "wearable"
                      ? "Wearables"
                      : deviceType.type === "drone"
                        ? "Drones"
                        : deviceType.type === "seh"
                          ? "Smart Helmets"
                          : "LoRa Modules"

              return (
                <Card key={deviceType.type}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{label}</CardTitle>
                    {icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{deviceType.count}</div>
                    <div className="flex items-center pt-1">
                      <span className="text-xs text-muted-foreground">{Math.round(deviceType.count * 0.9)} active</span>
                      <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Device Management</CardTitle>
              <CardDescription>Add, monitor, and manage devices in the network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button asChild>
                  <a href="/devices/add">Add New Device</a>
                </Button>
              </div>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 p-4 font-medium border-b">
                  <div className="col-span-2">Device Name</div>
                  <div>Type</div>
                  <div>Status</div>
                  <div>Battery</div>
                  <div>Actions</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-6 p-4 items-center">
                    <div className="col-span-2 font-medium">Ground Node G-001</div>
                    <div>Ground Node</div>
                    <div>
                      <Badge variant="destructive">Alert</Badge>
                    </div>
                    <div>92%</div>
                    <div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href="/devices/ground-nodes/G-001">View</a>
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 p-4 items-center">
                    <div className="col-span-2 font-medium">Marine Buoy M-002</div>
                    <div>Marine Buoy</div>
                    <div>
                      <Badge variant="destructive">Alert</Badge>
                    </div>
                    <div>78%</div>
                    <div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href="/devices/marine-buoys/M-002">View</a>
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 p-4 items-center">
                    <div className="col-span-2 font-medium">Marine Buoy M-003</div>
                    <div>Marine Buoy</div>
                    <div>
                      <Badge variant="warning">Warning</Badge>
                    </div>
                    <div>15%</div>
                    <div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href="/devices/marine-buoys/M-003">View</a>
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 p-4 items-center">
                    <div className="col-span-2 font-medium">Drone D-005</div>
                    <div>Drone</div>
                    <div>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div>65%</div>
                    <div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href="/devices/drones/D-005">View</a>
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 p-4 items-center">
                    <div className="col-span-2 font-medium">Smart Helmet H-008</div>
                    <div>Smart Helmet</div>
                    <div>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div>88%</div>
                    <div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href="/devices/helmets/H-008">View</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Log</CardTitle>
              <CardDescription>Recent system events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <EventTimeline />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
