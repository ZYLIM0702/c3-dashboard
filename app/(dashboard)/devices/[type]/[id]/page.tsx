"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  ArrowLeft,
  Battery,
  Cpu,
  Download,
  LifeBuoy,
  Radio,
  Settings,
  Signal,
  Smartphone,
  Waves,
  Wind,
} from "lucide-react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Link from "next/link"

// Sample data for sensor readings
const sensorData = [
  { time: "00:00", value: 0.2 },
  { time: "01:00", value: 0.3 },
  { time: "02:00", value: 0.2 },
  { time: "03:00", value: 0.4 },
  { time: "04:00", value: 0.6 },
  { time: "05:00", value: 1.2 },
  { time: "06:00", value: 2.5 },
  { time: "07:00", value: 3.8 },
  { time: "08:00", value: 2.1 },
  { time: "09:00", value: 1.5 },
  { time: "10:00", value: 0.8 },
  { time: "11:00", value: 0.5 },
  { time: "12:00", value: 0.3 },
]

export default function DeviceDetailsPage() {
  const params = useParams()
  const { type, id } = params

  // This would normally come from an API call
  const deviceInfo = {
    id: id as string,
    type: type as string,
    name: `${
      type === "ground_node"
        ? "Ground Node"
        : type === "marine_buoy"
          ? "Marine Buoy"
          : type === "wearable"
            ? "Wearable"
            : type === "drone"
              ? "Drone"
              : type === "seh"
                ? "Smart Helmet"
                : "Unknown Device"
    } ${id}`,
    status: id === "G-001" || id === "M-002" ? "critical" : "active",
    battery: Math.floor(Math.random() * 81) + 10, // 10-90%
    signal: Math.floor(Math.random() * 51) + 50, // 50-100%
    firmware: "v2.3.1",
    lastSeen: "10 minutes ago",
    location: {
      latitude: 3.139,
      longitude: 101.6869,
    },
  }

  const DeviceIcon =
    type === "ground-nodes"
      ? Radio
      : type === "marine-buoys"
        ? Waves
        : type === "wearables"
          ? Smartphone
          : type === "drones"
            ? Wind
            : LifeBuoy

  // Utility: Generate random value in range
  function randRange(min: number, max: number, decimals = 2) {
    return +(Math.random() * (max - min) + min).toFixed(decimals);
  }

  // Utility: Generate peripherals/sensors with random values for each device type
  function getPeripherals(type: string) {
    const t = (type || "").toString().toLowerCase();
    if (t === "ground-nodes" || t === "ground_node") {
      return [
        { name: "Power-On Pushbutton (R16-503)", type: "Digital input", pins: "GPIO 0", value: Math.random() > 0.8 ? "Pressed" : "Not Pressed" },
        { name: "Seismometer (fake)", type: "Simulated", pins: "–", value: randRange(0.1, 4.0) + "g" },
        { name: "GY-BMP280 (Pressure + Temp)", type: "I²C", pins: "SDA: GPIO 21, SCL: GPIO 22", value: `${randRange(980, 1050, 0)} hPa, ${randRange(20, 35, 1)}°C` },
        { name: "DHT11 (Humidity + Temp)", type: "1-wire digital", pins: "GPIO 4", value: `${randRange(40, 90, 0)}% RH, ${randRange(20, 35, 1)}°C` },
        { name: "MQ-2 Gas Sensor", type: "Analog (ADC)", pins: "GPIO 34 (ADC1_CH6)", value: `${randRange(0.1, 1.0)}V (${Math.random() > 0.95 ? 'Danger' : 'Safe'})` },
        { name: "Soil Moisture (capacitive)", type: "Analog (ADC)", pins: "GPIO 35 (ADC1_CH7)", value: `${randRange(20, 80, 0)}% Moisture` },
        { name: "INMP441 MEMS Microphone (I²S digital mic)", type: "I²S", pins: "WS: GPIO 25, SCK: GPIO 26, SD: GPIO 27", value: `${randRange(-60, -30, 0)} dB SPL` },
        { name: "MPU6050 (Accel/Gyro)", type: "I²C (shared)", pins: "SDA: GPIO 21, SCL: GPIO 22", value: `Accel: ${randRange(0, 0.1)}g, Gyro: ${randRange(0, 1)}°/s` },
        { name: "GY-NEO6MV2 GPS", type: "UART (Serial2)", pins: "RX2: GPIO 16, TX2: GPIO 17", value: `${randRange(3.0, 3.2, 4)}° N, ${randRange(101.5, 101.7, 4)}° E` },
        { name: "SX1278 LoRa Module", type: "SPI + GPIO", pins: "SCK: GPIO 18, MISO: GPIO 19, MOSI: GPIO 23, NSS: GPIO 5, DIO0: GPIO 26, RST: GPIO 14", value: Math.random() > 0.1 ? "Connected" : "Disconnected" },
        { name: "PTT Button (Hold to Talk)", type: "Digital input", pins: "GPIO 12", value: Math.random() > 0.7 ? "Pressed" : "Released" },
        { name: "Bluetooth Speaker (A2DP Sink)", type: "Bluetooth A2DP Source", pins: "–", value: Math.random() > 0.2 ? "Paired" : "Not Paired" },
        { name: "LED Beacon", type: "Digital output", pins: "GPIO 13", value: Math.random() > 0.5 ? "On" : "Off" },
        { name: "Cooling Fan (with MOSFET)", type: "Digital output", pins: "GPIO 27", value: Math.random() > 0.5 ? "On" : "Off" },
      ];
    } else if (t === "marine-buoys" || t === "marine_buoy") {
      return [
        { name: "Water Level Sensor", type: "Ultrasonic", pins: "GPIO 32 (ADC1_CH4)", value: `${randRange(1.0, 6.0, 2)} m` },
        { name: "Water Temperature Sensor", type: "Analog (ADC)", pins: "GPIO 33 (ADC1_CH5)", value: `${randRange(18, 32, 1)}°C` },
        { name: "Wave Height Sensor", type: "Accelerometer", pins: "I²C: GPIO 21/22", value: `${randRange(0.1, 2.0, 2)} m` },
        { name: "GPS Module", type: "UART", pins: "RX2: GPIO 16, TX2: GPIO 17", value: `${randRange(3.0, 3.2, 4)}° N, ${randRange(101.5, 101.7, 4)}° E` },
        { name: "LoRa Radio", type: "SPI", pins: "SCK: GPIO 18, MOSI: GPIO 23, MISO: GPIO 19", value: Math.random() > 0.1 ? "Connected" : "Disconnected" },
        { name: "Solar Panel", type: "Analog (ADC)", pins: "GPIO 36 (ADC1_CH0)", value: Math.random() > 0.2 ? "Charging" : "Idle" },
        { name: "Battery Voltage Sensor", type: "Analog (ADC)", pins: "GPIO 39 (ADC1_CH3)", value: `${randRange(3.5, 4.2, 2)}V` },
        { name: "LED Beacon", type: "Digital output", pins: "GPIO 13", value: Math.random() > 0.5 ? "On" : "Off" },
      ];
    } else if (t === "wearables" || t === "wearable") {
      return [
        { name: "Heart Rate Sensor", type: "I²C", pins: "SDA: GPIO 21, SCL: GPIO 22", value: `${randRange(60, 120, 0)} bpm` },
        { name: "SpO₂ Sensor", type: "I²C", pins: "SDA: GPIO 21, SCL: GPIO 22", value: `${randRange(92, 100, 0)}%` },
        { name: "Accelerometer", type: "I²C", pins: "SDA: GPIO 21, SCL: GPIO 22", value: `${randRange(0, 0.1, 2)}g` },
        { name: "Step Counter", type: "Internal", pins: "–", value: `${randRange(0, 10000, 0)}` },
        { name: "Bluetooth Module", type: "UART", pins: "RX: GPIO 16, TX: GPIO 17", value: Math.random() > 0.1 ? "Connected" : "Disconnected" },
        { name: "Temperature Sensor", type: "Analog (ADC)", pins: "GPIO 34 (ADC1_CH6)", value: `${randRange(35, 38, 1)}°C` },
        { name: "Battery Voltage Sensor", type: "Analog (ADC)", pins: "GPIO 35 (ADC1_CH7)", value: `${randRange(3.5, 4.2, 2)}V` },
      ];
    } else if (t === "drones" || t === "drone") {
      return [
        { name: "Altitude Sensor", type: "Barometer", pins: "I²C: GPIO 21/22", value: `${randRange(0, 120, 0)} m` },
        { name: "GPS Module", type: "UART", pins: "RX2: GPIO 16, TX2: GPIO 17", value: `${randRange(3.0, 3.2, 4)}° N, ${randRange(101.5, 101.7, 4)}° E` },
        { name: "IMU (Gyro/Accel)", type: "I²C", pins: "SDA: GPIO 21, SCL: GPIO 22", value: `Gyro: ${randRange(0, 5, 2)}°/s, Accel: ${randRange(0, 0.1, 2)}g` },
        { name: "Camera", type: "CSI", pins: "CAM_DATA, CAM_CLK", value: Math.random() > 0.1 ? "Active" : "Inactive" },
        { name: "Motor Controller", type: "PWM", pins: "GPIO 14, 15, 16, 17", value: Math.random() > 0.2 ? "Running" : "Stopped" },
        { name: "Battery Voltage Sensor", type: "Analog (ADC)", pins: "GPIO 36 (ADC1_CH0)", value: `${randRange(10.0, 12.6, 2)}V` },
      ];
    } else if (t === "helmets" || t === "seh" || t === "smart-helmet") {
      return [
        { name: "Heart Rate Sensor", type: "I²C", pins: "SDA: GPIO 21, SCL: GPIO 22", value: `${randRange(60, 120, 0)} bpm` },
        { name: "SpO₂ Sensor", type: "I²C", pins: "SDA: GPIO 21, SCL: GPIO 22", value: `${randRange(92, 100, 0)}%` },
        { name: "Temperature Sensor", type: "Analog (ADC)", pins: "GPIO 34 (ADC1_CH6)", value: `${randRange(35, 38, 1)}°C` },
        { name: "Accelerometer", type: "I²C", pins: "SDA: GPIO 21, SCL: GPIO 22", value: `${randRange(0, 0.1, 2)}g` },
        { name: "Bluetooth Module", type: "UART", pins: "RX: GPIO 16, TX: GPIO 17", value: Math.random() > 0.1 ? "Connected" : "Disconnected" },
        { name: "LED Indicator", type: "Digital output", pins: "GPIO 13", value: Math.random() > 0.5 ? "On" : "Off" },
      ];
    } else {
      return [];
    }
  }

  // Utility: Export device data as CSV
  function handleExportData() {
    const csvRows = [["Row", "Timestamp", "Name", "Type", "Pins", "Value"]];
    const now = new Date();
    for (let i = 1; i <= 200; i++) {
      // Generate a random timestamp in the past 7 days, never in the future
      const pastMs = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // up to 7 days ago
      const ts = new Date(now.getTime() - pastMs);
      const timestamp = ts.toISOString();
      const peripherals = getPeripherals(String(type ?? ""));
      for (const row of peripherals) {
        csvRows.push([String(i), timestamp, row.name, row.type, row.pins, row.value]);
      }
    }
    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deviceInfo.name.replace(/\s+/g, '_')}_peripherals.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/devices">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <DeviceIcon className="h-6 w-6" />
            {deviceInfo.name}
          </h1>
          <div className="flex items-center gap-2">
            <Badge className={deviceInfo.status === "critical" ? "bg-red-500 text-white" : "bg-green-500 text-white"}>
              {deviceInfo.status === "critical" ? "Critical" : "Active"}
            </Badge>
            <p className="text-muted-foreground">ID: {deviceInfo.id}</p>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery Level</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceInfo.battery}%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div
                className={`h-2 rounded-full ${
                  deviceInfo.battery < 20 ? "bg-red-500" : deviceInfo.battery < 50 ? "bg-yellow-500" : "bg-green-500"
                }`}
                style={{ width: `${deviceInfo.battery}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {deviceInfo.battery < 20
                ? "Critical - Needs charging"
                : deviceInfo.battery < 50
                  ? "Warning - Consider charging"
                  : "Good - No action needed"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signal Strength</CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceInfo.signal}%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-green-500" style={{ width: `${deviceInfo.signal}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Strong connection - Optimal data transmission</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Firmware</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceInfo.firmware}</div>
            <p className="mt-2 text-xs text-muted-foreground">Latest version - Up to date</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="hazard-mapping" asChild>
            <Link href="/analytics/hazard-mapping">Hazard Mapping (AI)</Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
                <CardDescription>Detailed information about this device</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Device Type</h3>
                    <p>
                      {type === "ground_node"
                        ? "Ground Node"
                        : type === "marine_buoy"
                          ? "Marine Buoy"
                          : type === "wearable"
                            ? "Wearable"
                            : type === "drone"
                              ? "Drone"
                              : type === "seh"
                                ? "Smart Helmet"
                                : "Unknown Device"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <p className="capitalize">{deviceInfo.status}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Last Seen</h3>
                    <p>{deviceInfo.lastSeen}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Firmware</h3>
                    <p>{deviceInfo.firmware}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Latitude</h3>
                    <p>{deviceInfo.location.latitude}° N</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Longitude</h3>
                    <p>{deviceInfo.location.longitude}° E</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Current device location</CardDescription>
              </CardHeader>
              <CardContent>
                {/* GoogleMap removed due to missing component. Use OSM iframe as fallback. */}
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${deviceInfo.location.longitude - 0.01}%2C${deviceInfo.location.latitude - 0.01}%2C${deviceInfo.location.longitude + 0.01}%2C${deviceInfo.location.latitude + 0.01}&amp;layer=mapnik`}
                  style={{ border: "1px solid black", width: "100%", height: 200, borderRadius: 8 }}
                  title="Device Location Map"
                />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Coordinates</h3>
                    <p>
                      {deviceInfo.location.latitude}° N, {deviceInfo.location.longitude}° E
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Region</h3>
                    <p>Kuala Lumpur, Malaysia</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* New Peripherals & Sensors Section */}
          <Card>
            <CardHeader>
              <CardTitle>Peripherals & Sensors</CardTitle>
              <CardDescription>All connected sensors and peripherals (fake data)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getPeripherals(String(type ?? "")).map((item, idx) => (
                  <div key={idx} className="rounded-lg border p-4 flex flex-col gap-1">
                    <div className="font-semibold text-base">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.type}</div>
                    <div className="text-xs text-muted-foreground">Pins: {item.pins}</div>
                    <div className="mt-1 text-sm font-mono">{item.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Recent events and activities for this device</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {deviceInfo.id === "G-001" && (
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
                        <Badge className="bg-red-500 text-white">Critical</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Detected unusual vibrations at coordinates 3.1390° N, 101.6869° E.
                      </p>
                      <div className="mt-1 text-xs text-muted-foreground">10 minutes ago</div>
                    </div>
                  </div>
                )}

                {deviceInfo.id === "M-002" && (
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
                        <Badge className="bg-red-500 text-white">Critical</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Detected rapid water level rise at coordinates 3.0738° N, 101.5183° E.
                      </p>
                      <div className="mt-1 text-xs text-muted-foreground">25 minutes ago</div>
                    </div>
                  </div>
                )}

                {deviceInfo.id === "M-003" && (
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
                        <Badge className="bg-yellow-400 text-black">Warning</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Battery level at 15%. Requires maintenance soon.
                      </p>
                      <div className="mt-1 text-xs text-muted-foreground">30 minutes ago</div>
                    </div>
                  </div>
                )}

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                      <Signal className="h-5 w-5" />
                    </div>
                    <div className="w-px h-full bg-gray-300 mt-2"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Connection Established</h3>
                      <Badge className="bg-blue-500 text-white">Info</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Device connected to the network with strong signal.
                    </p>
                    <div className="mt-1 text-xs text-muted-foreground">1 hour ago</div>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
                      <Cpu className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Firmware Updated</h3>
                      <Badge className="bg-blue-500 text-white">Info</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Device firmware updated to version {deviceInfo.firmware}.
                    </p>
                    <div className="mt-1 text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sensors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Readings</CardTitle>
              <CardDescription>Real-time data from device sensors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[100%]">
                <ChartContainer
                  config={{
                    value: {
                      label:
                        type === "ground-nodes"
                          ? "Seismic Activity"
                          : type === "marine-buoys"
                            ? "Water Level"
                            : type === "wearables"
                              ? "Heart Rate"
                              : type === "drones"
                                ? "Altitude"
                                : type === "helmets"
                                  ? "Heart Rate"
                                  : "Sensor Reading",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={sensorData}
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

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {type === "ground-nodes" && (
                  <>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Seismic Activity</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{deviceInfo.id === "G-001" ? "3.8" : "0.2"}</div>
                        <p className="text-xs text-muted-foreground">
                          {deviceInfo.id === "G-001" ? "Above normal - Alert threshold" : "Normal range"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Temperature</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">28°C</div>
                        <p className="text-xs text-muted-foreground">Normal range</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Humidity</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">65%</div>
                        <p className="text-xs text-muted-foreground">Normal range</p>
                      </CardContent>
                    </Card>
                  </>
                )}

                {type === "marine-buoys" && (
                  <>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Water Level</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{deviceInfo.id === "M-002" ? "5.3 m" : "2.5 m"}</div>
                        <p className="text-xs text-muted-foreground">
                          {deviceInfo.id === "M-002" ? "Above normal - Alert threshold" : "Normal range"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Water Temperature</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">24°C</div>
                        <p className="text-xs text-muted-foreground">Normal range</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Wave Height</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">0.8 m</div>
                        <p className="text-xs text-muted-foreground">Normal range</p>
                      </CardContent>
                    </Card>
                  </>
                )}

                {type === "wearables" && (
                  <>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Heart Rate</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">78 bpm</div>
                        <p className="text-xs text-muted-foreground">Normal range</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">SpO₂</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">98%</div>
                        <p className="text-xs text-muted-foreground">Normal range</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Steps</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">3,245</div>
                        <p className="text-xs text-muted-foreground">Today</p>
                      </CardContent>
                    </Card>
                  </>
                )}

                {type === "drones" && (
                  <>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Altitude</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">45 m</div>
                        <p className="text-xs text-muted-foreground">Current flight altitude</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Speed</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">12 m/s</div>
                        <p className="text-xs text-muted-foreground">Current flight speed</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Flight Time</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">18 min</div>
                        <p className="text-xs text-muted-foreground">Remaining flight time</p>
                      </CardContent>
                    </Card>
                  </>
                )}

                {type === "helmets" && (
                  <>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Heart Rate</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">82 bpm</div>
                        <p className="text-xs text-muted-foreground">Normal range</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">SpO₂</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">97%</div>
                        <p className="text-xs text-muted-foreground">Normal range</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Temperature</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">36.8°C</div>
                        <p className="text-xs text-muted-foreground">Normal range</p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>Recent alerts from this device</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceInfo.id === "G-001" && (
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500 text-white">Critical</Badge>
                        <h3 className="font-semibold">Seismic Activity Detected</h3>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Detected unusual vibrations at coordinates 3.1390° N, 101.6869° E.
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">10 minutes ago</div>
                  </div>
                )}

                {deviceInfo.id === "M-002" && (
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500 text-white">Critical</Badge>
                        <h3 className="font-semibold">Flood Warning</h3>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Detected rapid water level rise at coordinates 3.0738° N, 101.5183° E.
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">25 minutes ago</div>
                  </div>
                )}

                {deviceInfo.id === "M-003" && (
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-400 text-black">Warning</Badge>
                        <h3 className="font-semibold">Battery Low</h3>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Battery level at 15%. Requires maintenance soon.
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">30 minutes ago</div>
                  </div>
                )}

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500 text-white">Info</Badge>
                      <h3 className="font-semibold">Connection Established</h3>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Device connected to the network with strong signal.
                  </p>
                  <div className="mt-2 text-xs text-muted-foreground">1 hour ago</div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500 text-white">Info</Badge>
                      <h3 className="font-semibold">Firmware Updated</h3>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Device firmware updated to version {deviceInfo.firmware}.
                  </p>
                  <div className="mt-2 text-xs text-muted-foreground">2 hours ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Settings</CardTitle>
              <CardDescription>Configure device parameters and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="device-name" className="block text-sm font-medium text-muted-foreground mb-1">
                      Device Name
                    </label>
                    <input
                      type="text"
                      id="device-name"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      defaultValue={deviceInfo.name}
                    />
                  </div>
                  <div>
                    <label htmlFor="update-interval" className="block text-sm font-medium text-muted-foreground mb-1">
                      Update Interval (seconds)
                    </label>
                    <input
                      type="number"
                      id="update-interval"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      defaultValue={60}
                      min={10}
                      max={3600}
                    />
                  </div>
                  <div>
                    <label htmlFor="alert-threshold" className="block text-sm font-medium text-muted-foreground mb-1">
                      Alert Threshold
                    </label>
                    <input
                      type="number"
                      id="alert-threshold"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      defaultValue={3.0}
                      step={0.1}
                      min={0.1}
                    />
                  </div>
                  <div>
                    <label htmlFor="battery-warning" className="block text-sm font-medium text-muted-foreground mb-1">
                      Battery Warning Level (%)
                    </label>
                    <input
                      type="number"
                      id="battery-warning"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      defaultValue={20}
                      min={5}
                      max={50}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Alert Notifications</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notify-email"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="notify-email" className="text-sm">
                        Email
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notify-sms"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="notify-sms" className="text-sm">
                        SMS
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notify-push"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="notify-push" className="text-sm">
                        Push Notification
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance</CardTitle>
              <CardDescription>Device maintenance and advanced options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Button variant="outline">Restart Device</Button>
                  <Button variant="outline">Factory Reset</Button>
                  <Button variant="outline">Check for Updates</Button>
                  <Button variant="outline">Calibrate Sensors</Button>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Danger Zone</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-destructive p-4">
                      <h4 className="font-medium text-destructive">Decommission Device</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        This will remove the device from the network and delete all associated data. This action cannot
                        be undone.
                      </p>
                      <div className="mt-2">
                        <Button variant="destructive" size="sm">
                          Decommission
                        </Button>
                      </div>
                    </div>
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
