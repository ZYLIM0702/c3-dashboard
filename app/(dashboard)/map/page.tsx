"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Cpu, LifeBuoy, Radio, Smartphone, Waves, Wind } from "lucide-react"

export default function MapPage() {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

  // This would be replaced with a real map component like Mapbox or Leaflet
  // For now, we'll just show a placeholder
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Map View</h1>
        <p className="text-muted-foreground">Geospatial visualization of all devices in the HUB network</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-3">
          <Card className="h-[calc(100vh-220px)] min-h-[500px]">
            <CardHeader>
              <CardTitle>Device Map</CardTitle>
              <CardDescription>Interactive map showing all device locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-full w-full rounded-md bg-muted flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Map visualization would be displayed here</p>
                  <p className="text-muted-foreground text-sm mt-2">Integrate with Mapbox, Leaflet, or Google Maps</p>
                </div>

                {/* Sample device markers - these would be positioned on the actual map */}
                <div className="absolute top-1/4 left-1/4 cursor-pointer" onClick={() => setSelectedDevice("G-001")}>
                  <div className="relative">
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                    <div className="absolute -top-1 -left-1 h-6 w-6 animate-ping rounded-full bg-red-500 opacity-75"></div>
                  </div>
                </div>

                <div className="absolute top-1/3 left-1/2 cursor-pointer" onClick={() => setSelectedDevice("M-002")}>
                  <div className="relative">
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                    <div className="absolute -top-1 -left-1 h-6 w-6 animate-ping rounded-full bg-blue-500 opacity-75"></div>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/3 cursor-pointer" onClick={() => setSelectedDevice("D-005")}>
                  <div className="h-4 w-4 rounded-full bg-purple-500"></div>
                </div>

                <div className="absolute top-2/3 left-2/3 cursor-pointer" onClick={() => setSelectedDevice("H-008")}>
                  <div className="h-4 w-4 rounded-full bg-green-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-[calc(100vh-220px)] min-h-[500px]">
            <CardHeader>
              <CardTitle>Device Filters</CardTitle>
              <CardDescription>Filter devices shown on the map</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ground-nodes"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="ground-nodes" className="text-sm font-medium flex items-center gap-2">
                        <Radio className="h-4 w-4 text-muted-foreground" />
                        Ground Nodes
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="marine-buoys"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="marine-buoys" className="text-sm font-medium flex items-center gap-2">
                        <Waves className="h-4 w-4 text-muted-foreground" />
                        Marine Buoys
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="wearables"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="wearables" className="text-sm font-medium flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        Wearables
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="drones" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                      <label htmlFor="drones" className="text-sm font-medium flex items-center gap-2">
                        <Wind className="h-4 w-4 text-muted-foreground" />
                        Drones
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="helmets" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                      <label htmlFor="helmets" className="text-sm font-medium flex items-center gap-2">
                        <LifeBuoy className="h-4 w-4 text-muted-foreground" />
                        Smart Helmets
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-2">Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="status-active"
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="status-active" className="text-sm font-medium">
                          Active
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="status-warning"
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="status-warning" className="text-sm font-medium">
                          Warning
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="status-offline"
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="status-offline" className="text-sm font-medium">
                          Offline
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="status-critical"
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="status-critical" className="text-sm font-medium">
                          Critical
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">Apply Filters</Button>
                </TabsContent>
                <TabsContent value="alerts" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="alert-critical"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="alert-critical" className="text-sm font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Critical Alerts
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="alert-warning"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="alert-warning" className="text-sm font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Warnings
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="alert-info"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="alert-info" className="text-sm font-medium flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-blue-500" />
                        System Alerts
                      </label>
                    </div>
                  </div>

                  <Button className="w-full">Apply Filters</Button>
                </TabsContent>
              </Tabs>

              {selectedDevice && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Selected Device</h3>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {selectedDevice.startsWith("G") && <Radio className="h-4 w-4" />}
                        {selectedDevice.startsWith("M") && <Waves className="h-4 w-4" />}
                        {selectedDevice.startsWith("D") && <Wind className="h-4 w-4" />}
                        {selectedDevice.startsWith("H") && <LifeBuoy className="h-4 w-4" />}
                        <span className="font-medium">
                          {selectedDevice.startsWith("G")
                            ? `Ground Node ${selectedDevice}`
                            : selectedDevice.startsWith("M")
                              ? `Marine Buoy ${selectedDevice}`
                              : selectedDevice.startsWith("D")
                                ? `Drone ${selectedDevice}`
                                : `Smart Helmet ${selectedDevice}`}
                        </span>
                      </div>
                      <Badge
                        variant={
                          selectedDevice === "G-001"
                            ? "destructive"
                            : selectedDevice === "M-002"
                              ? "destructive"
                              : "success"
                        }
                      >
                        {selectedDevice === "G-001" ? "Critical" : selectedDevice === "M-002" ? "Critical" : "Active"}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-muted-foreground">Status:</span>
                        <span>
                          {selectedDevice === "G-001"
                            ? "Alert - Seismic Activity"
                            : selectedDevice === "M-002"
                              ? "Alert - Flood Warning"
                              : "Normal Operation"}
                        </span>
                        <span className="text-muted-foreground">Battery:</span>
                        <span>{selectedDevice === "M-003" ? "15%" : "85%"}</span>
                        <span className="text-muted-foreground">Last Update:</span>
                        <span>10 minutes ago</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
