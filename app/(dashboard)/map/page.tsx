"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OSMMap } from "@/components/osm-map"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, LifeBuoy, Radio, Smartphone, Waves, Wind } from "lucide-react"
import { SupabaseService } from "@/services/supabase-service"

export default function MapPage() {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [show3DBuildings, setShow3DBuildings] = useState(true)
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDevices() {
      setLoading(true)
      try {
        const supabaseService = new SupabaseService()
        const data = await supabaseService.getDevices()

        if (data) {
          // Add random coordinates for devices that don't have them
          const devicesWithCoordinates = data.map((device) => {
            if (!device.latitude || !device.longitude) {
              // Generate random coordinates around Kuala Lumpur
              return {
                ...device,
                latitude: 3.139 + (Math.random() - 0.5) * 0.1,
                longitude: 101.6869 + (Math.random() - 0.5) * 0.1,
              }
            }
            return device
          })
          setDevices(devicesWithCoordinates)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDevices()
  }, [])

  // Sample device data in case the database is empty
  const sampleDevices = [
    {
      id: "G-001",
      name: "Ground Node G-001",
      type: "ground-nodes",
      status: "critical",
      latitude: 3.139,
      longitude: 101.6869,
      alert: "Seismic Activity",
      battery: 85,
    },
    {
      id: "M-002",
      name: "Marine Buoy M-002",
      type: "marine-buoys",
      status: "critical",
      latitude: 3.0738,
      longitude: 101.5183,
      alert: "Flood Warning",
      battery: 72,
    },
    {
      id: "D-005",
      name: "Drone D-005",
      type: "drones",
      status: "active",
      latitude: 3.1569,
      longitude: 101.7123,
      battery: 65,
    },
    {
      id: "H-008",
      name: "Smart Helmet H-008",
      type: "helmets",
      status: "active",
      latitude: 3.1112,
      longitude: 101.5983,
      battery: 90,
    },
  ]

  // Use sample devices if no devices are found in the database
  const displayDevices = devices.length > 0 ? devices : sampleDevices

  // Generate markers from devices
  const markers = displayDevices.map((device) => ({
    position: [device.latitude || 0, device.longitude || 0] as [number, number],
    title: device.name,
    type: device.type,
    status: device.status,
    id: device.id,
  }))

  // Calculate center based on markers or default to KL
  const center =
    markers.length > 0
      ? ([
          markers.reduce((sum, m) => sum + m.position[0], 0) / markers.length,
          markers.reduce((sum, m) => sum + m.position[1], 0) / markers.length,
        ] as [number, number])
      : ([3.139, 101.6869] as [number, number])

  // Generate random heatmap data around device locations
  const heatmapData = displayDevices.flatMap((device) => {
    if (!device.latitude || !device.longitude) return []

    // Generate more points for critical/warning devices
    const pointCount = device.status === "critical" ? 20 : device.status === "warning" ? 10 : 5

    return Array.from({ length: pointCount }, () => {
      // Random offset within ~500m
      const latOffset = (Math.random() - 0.5) * 0.01
      const lngOffset = (Math.random() - 0.5) * 0.01

      // Weight based on status
      const weight = device.status === "critical" ? 1 : device.status === "warning" ? 0.7 : 0.3

      return [device.latitude + latOffset, device.longitude + lngOffset, weight] as [number, number, number]
    })
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Map View</h1>
        <p className="text-muted-foreground">Geospatial visualization of all devices in the HUB network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Card className="h-[calc(100vh-220px)] min-h-[500px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Device Map</CardTitle>
                <CardDescription>Interactive map showing all device locations</CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch id="heatmap" checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                  <Label htmlFor="heatmap">Heatmap</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="3d-buildings" checked={show3DBuildings} onCheckedChange={setShow3DBuildings} />
                  <Label htmlFor="3d-buildings">3D Buildings</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-5rem)]">
              <OSMMap
                markers={markers}
                center={center}
                zoom={12}
                height="100%"
                width="100%"
                show3DBuildings={show3DBuildings}
                selectedDeviceId={selectedDevice}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-[calc(100vh-220px)] min-h-[500px]">
            <CardHeader>
              <CardTitle>Devices</CardTitle>
              <CardDescription>Filter and select devices on the map</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto h-[calc(100%-5rem)]">
              <div className="space-y-2">
                {loading ? (
                  <p>Loading devices...</p>
                ) : displayDevices.length === 0 ? (
                  <p>No devices found</p>
                ) : (
                  displayDevices.map((device) => (
                    <div
                      key={device.id}
                      className={`p-3 rounded-md border cursor-pointer transition-colors ${
                        selectedDevice === device.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedDevice(selectedDevice === device.id ? null : device.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {device.type === "ground-nodes" && <Radio className="h-4 w-4" />}
                          {device.type === "marine-buoys" && <Waves className="h-4 w-4" />}
                          {device.type === "wearables" && <Smartphone className="h-4 w-4" />}
                          {device.type === "drones" && <Wind className="h-4 w-4" />}
                          {device.type === "helmets" && <LifeBuoy className="h-4 w-4" />}
                          <span className="font-medium">{device.name}</span>
                        </div>
                        <Badge
                          className={
                            device.status === "critical"
                              ? "bg-red-500 text-white"
                              : device.status === "warning"
                                ? "bg-yellow-500 text-black"
                                : device.status === "offline"
                                  ? "bg-gray-300 text-gray-700"
                                  : "bg-green-500 text-white"
                          }
                        >
                          {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                        </Badge>
                      </div>
                      {device.alert && (
                        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {device.alert}
                        </div>
                      )}
                      {device.battery !== undefined && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Battery: {device.battery}%
                          <div className="mt-1 h-1 w-full rounded-full bg-muted">
                            <div
                              className={`h-1 rounded-full ${
                                device.battery < 20
                                  ? "bg-red-500"
                                  : device.battery < 50
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{ width: `${device.battery}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
