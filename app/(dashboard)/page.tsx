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

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Command & Control Center for Humanitarian Unified Backbone (HUB)</p>
      </div>

      <Alert variant="destructive" className="border-red-600">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Critical Alert</AlertTitle>
        <AlertDescription>
          Seismic activity detected by Ground Node G-001. Potential earthquake warning.
          <Button variant="link" className="h-auto p-0 ml-2">
            View details
          </Button>
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">+2 critical</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">3 devices need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery Status</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
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
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Critical</Badge>
                      <h3 className="font-semibold">Seismic Activity Detected</h3>
                    </div>
                    <Button size="sm" variant="outline">
                      Acknowledge
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Ground Node G-001 detected unusual vibrations at coordinates 3.1390° N, 101.6869° E.
                  </p>
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <span>10 minutes ago</span>
                    <span className="mx-2">•</span>
                    <span>Device ID: G-001</span>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Critical</Badge>
                      <h3 className="font-semibold">Flood Warning</h3>
                    </div>
                    <Button size="sm" variant="outline">
                      Acknowledge
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Marine Buoy M-002 detected rapid water level rise at coordinates 3.0738° N, 101.5183° E.
                  </p>
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <span>25 minutes ago</span>
                    <span className="mx-2">•</span>
                    <span>Device ID: M-002</span>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="warning">Warning</Badge>
                      <h3 className="font-semibold">Battery Low</h3>
                    </div>
                    <Button size="sm" variant="outline">
                      Acknowledge
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Marine Buoy M-003 battery level at 15%. Requires maintenance soon.
                  </p>
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <span>30 minutes ago</span>
                    <span className="mx-2">•</span>
                    <span>Device ID: M-003</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ground Nodes</CardTitle>
                <Radio className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">38 active</span>
                  <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Marine Buoys</CardTitle>
                <Waves className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">22 active</span>
                  <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wearables</CardTitle>
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">36</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">30 active</span>
                  <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drones</CardTitle>
                <Wind className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">8 active</span>
                  <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Smart Helmets</CardTitle>
                <LifeBuoy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">14 active</span>
                  <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Device Management</CardTitle>
              <CardDescription>Add, monitor, and manage devices in the network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>Add New Device</Button>
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
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div>92%</div>
                    <div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 p-4 items-center">
                    <div className="col-span-2 font-medium">Marine Buoy M-002</div>
                    <div>Marine Buoy</div>
                    <div>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div>78%</div>
                    <div>
                      <Button variant="ghost" size="sm">
                        View
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
                      <Button variant="ghost" size="sm">
                        View
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
                      <Button variant="ghost" size="sm">
                        View
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
                      <Button variant="ghost" size="sm">
                        View
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
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="w-px h-full bg-gray-300 mt-2"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Critical Alert: Seismic Activity</h3>
                      <Badge variant="destructive">Critical</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ground Node G-001 detected unusual vibrations at coordinates 3.1390° N, 101.6869° E.
                    </p>
                    <div className="mt-1 text-xs text-muted-foreground">10 minutes ago</div>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="w-px h-full bg-gray-300 mt-2"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Critical Alert: Flood Warning</h3>
                      <Badge variant="destructive">Critical</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Marine Buoy M-002 detected rapid water level rise at coordinates 3.0738° N, 101.5183° E.
                    </p>
                    <div className="mt-1 text-xs text-muted-foreground">25 minutes ago</div>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600">
                      <Battery className="h-5 w-5" />
                    </div>
                    <div className="w-px h-full bg-gray-300 mt-2"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Warning: Battery Low</h3>
                      <Badge variant="warning">Warning</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Marine Buoy M-003 battery level at 15%. Requires maintenance soon.
                    </p>
                    <div className="mt-1 text-xs text-muted-foreground">30 minutes ago</div>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                      <Cpu className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">System Update Available</h3>
                      <Badge variant="outline">Info</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      New firmware v2.3.1 ready to install for all devices.
                    </p>
                    <div className="mt-1 text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
