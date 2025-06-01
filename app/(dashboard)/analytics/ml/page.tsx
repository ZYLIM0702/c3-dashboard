"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SupabaseService } from "@/services/supabase-service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
} from "recharts";
import { useSpring, animated } from "react-spring";
// Dynamically import MapContainer and related components to avoid SSR errors
import dynamic from "next/dynamic";
const DynamicMap = dynamic(() => import("./MapSensingClient"), { ssr: false });
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Mic,
  Video,
  Phone,
  AlertCircle,
  Satellite,
  Anchor,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { ImageSegmenter, FilesetResolver } from "@mediapipe/tasks-vision";
import { Switch } from "@/components/ui/switch";


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
];

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
];

const sampleModels = [
  {
    endpoint: "/predict/seismic",
    models: ["QuakeFlow", "LSTM"],
  },
  { endpoint: "/predict/flood", models: ["LSTM", "GRU", "XGBoost"] },
  { endpoint: "/predict/object-detect", models: ["YOLOv5/v8"] },
  { endpoint: "/predict/health", models: ["LSTM", "Autoencoder", "XGBoost"] },
  { endpoint: "/predict/llm-rescue", models: ["Phi-2", "TinyLLaMA"] },
];

// Remove these lines:
// const nodeIcon = new L.Icon({ ... });
// const triggeredIcon = new L.Icon({ ... });
// const droneIcon = new L.Icon({ ... });

export default function MachineLearningAnalyticsPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [mlResults, setMlResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [simulation] = useState(true); // always true, not used in SimulationTab anymore
  const [streaming, setStreaming] = useState(true); // camera streaming ON by default

  useEffect(() => {
    setLoading(true);
    async function fetchDevices() {
      try {
        const supabaseService = new SupabaseService();
        const data = await supabaseService.getDevices();
        // Fix the object spread bug in fetchDevices
        setDevices(
          data.map((device) => ({
            ...device,
            heart_rate: Math.floor(Math.random() * 60) + 60,
            spo2: Math.floor(Math.random() * 15) + 85,
          }))
        );
      } catch {
        setDevices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDevices();
  }, []);

  useEffect(() => {
    async function fetchML() {
      if (!devices.length) return;
      const results: Record<string, any> = {};
      await Promise.all(
        devices.map(async (device) => {
          try {
            const res = await fetch("http://localhost:8001/predict/health", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                heart_rate: [device.heart_rate || 80],
                spo2: [device.spo2 || 98],
                meta: { id: device.id },
              }),
            });
            const data = await res.json();
            results[device.id] = data;
          } catch {
            results[device.id] = null;
          }
        })
      );
      setMlResults(results);
    }
    fetchML();
    const interval = setInterval(fetchML, 3000);
    return () => clearInterval(interval);
  }, [devices]);

  const chartData = devices.map((device) => ({
    name: device.name,
    risk: mlResults[device.id]?.risk?.toFixed(2) || 0,
  }));

  const averageRisk =
    devices.reduce(
      (acc, device) => acc + (mlResults[device.id]?.risk || 0),
      0
    ) / (devices.length || 1);

  // Radar data for performance metrics
  const radarData = [
    { metric: "Accuracy", value: 0.9 },
    { metric: "Precision", value: 0.85 },
    { metric: "Recall", value: 0.8 },
    { metric: "F1-Score", value: 0.82 },
    { metric: "Latency", value: 0.7 },
  ];

  // Animation for the gauge value
  const spring = useSpring({
    val: averageRisk * 100,
    config: { tension: 120, friction: 18 },
  });

  // Sample data for device status, alert types, and device types
  const deviceStatusData = [
    { name: "Active", value: 112, color: "#22c55e" },
    { name: "Warning", value: 8, color: "#f59e0b" },
    { name: "Offline", value: 5, color: "#6b7280" },
    { name: "Critical", value: 3, color: "#ef4444" },
  ];

  const alertTypeData = [
    { name: "Seismic", value: 12 },
    { name: "Flood", value: 8 },
    { name: "Battery", value: 15 },
    { name: "Connection", value: 7 },
    { name: "System", value: 5 },
  ];

  const deviceTypeData = [
    { name: "Ground Nodes", value: 42 },
    { name: "Marine Buoys", value: 24 },
    { name: "Wearables", value: 36 },
    { name: "Drones", value: 12 },
    { name: "Smart Helmets", value: 14 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and insights for the HUB network
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="training">Model Training</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <Card>
              <CardHeader>
                <CardTitle>Device Status Distribution</CardTitle>
                <CardDescription>
                  Current status of all devices in the network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
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
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
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
                                      style={{
                                        backgroundColor:
                                          payload[0].payload.color,
                                      }}
                                    />
                                    <span className="text-sm font-medium">
                                      {payload[0].name}
                                    </span>
                                  </div>
                                  <div className="text-right text-sm font-medium">
                                    {payload[0].value} devices
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
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
                <CardDescription>
                  Distribution of alerts by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
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
                                    <span className="text-sm font-medium">
                                      {label}
                                    </span>
                                  </div>
                                  <div className="text-right text-sm font-medium">
                                    {payload[0].value} alerts
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
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
                <CardDescription>
                  Distribution of devices by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
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
                                    <span className="text-sm font-medium">
                                      {label}
                                    </span>
                                  </div>
                                  <div className="text-right text-sm font-medium">
                                    {payload[0].value} devices
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                  Average risk across all devices
                </CardDescription>
              </CardHeader>
              <CardContent
                className="flex justify-center items-center p-0"
                style={{ height: 180 }}
              >
                <AnimatedGauge value={spring.val} />
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    data={radarData}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Model"
                      dataKey="value"
                      fill="#6366f1"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Available Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Models</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleModels.map((item) => (
                      <TableRow key={item.endpoint}>
                        <TableCell>{item.endpoint}</TableCell>
                        <TableCell>
                          {item.models.map((m) => (
                            <Badge key={m} className="mr-1">
                              {m}
                            </Badge>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Area Sensing Map</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <div className="w-full h-full rounded-2xl shadow-lg overflow-hidden">
                  <DynamicMap />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 flex flex-col ">
              <CardHeader className="w-full">
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-full w-full flex items-center justify-center">
                <ResponsiveContainer width="90%" height="100%">
                  <BarChart data={chartData} style={{ margin: "0 auto" }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Bar dataKey="risk">
                      {chartData.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={entry.risk > 0.7 ? "#f43f5e" : "#22c55e"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Seismic Event Prediction</CardTitle>
                <CardDescription>
                  Predicted probability of seismic events in the next 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={seismicData.map((d, i) => ({
                        ...d,
                        prediction: Math.max(
                          0,
                          Math.min(1, 0.1 + 0.05 * Math.sin(i / 2))
                        ),
                      }))}
                      margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })
                        }
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        className="text-xs"
                      />
                      <YAxis
                        domain={[0, 1]}
                        tickFormatter={(v) => `${Math.round(v * 100)}%`}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        className="text-xs"
                      />
                      <Tooltip
                        formatter={(value: number) =>
                          `${Math.round(value * 100)}%`
                        }
                        labelFormatter={(label) =>
                          new Date(label).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="prediction"
                        stroke="#f43f5e"
                        strokeWidth={2}
                        dot={false}
                        name="Predicted Probability"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>Flood Risk Assessment</CardTitle>
                <CardDescription>
                  ML-based flood risk score for the next 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={waterData.map((d, i) => ({
                        ...d,
                        risk: Math.max(
                          0,
                          Math.min(1, 0.2 + 0.07 * Math.cos(i / 2))
                        ),
                      }))}
                      margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })
                        }
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        className="text-xs"
                      />
                      <YAxis
                        domain={[0, 1]}
                        tickFormatter={(v) => `${Math.round(v * 100)}%`}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        className="text-xs"
                      />
                      <Tooltip
                        formatter={(value: number) =>
                          `${Math.round(value * 100)}%`
                        }
                        labelFormatter={(label) =>
                          new Date(label).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="risk"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        name="Flood Risk Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Training Progress</CardTitle>
                <CardDescription>
                  Live progress of current model training jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TrainingProgressTable />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Training Metrics</CardTitle>
                <CardDescription>Epoch-wise accuracy and loss</CardDescription>
              </CardHeader>
              <CardContent>
                <TrainingMetricsChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="simulation">
          <SimulationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AnimatedGauge({ value }: { value: any }) {
  return (
    <svg width={180} height={110} viewBox="0 0 180 110">
      {/* Track */}
      <path
        d="M20,90 A70,70 0 0,1 160,90"
        fill="none"
        stroke="#222"
        strokeWidth={16}
      />
      {/* Animated Arc */}
      <animated.path
        d="M20,90 A70,70 0 0,1 160,90"
        fill="none"
        stroke="#22c55e"
        strokeWidth={16}
        strokeDasharray={220}
        strokeDashoffset={value.to((val: number) => 220 - (val / 100) * 220)}
        style={{ filter: "drop-shadow(0 0 8px #22c55e)" }}
      />
      {/* Value */}
      <animated.text
        x="90"
        y="70"
        textAnchor="middle"
        fontSize="2.2rem"
        fontWeight="bold"
        fill="#fff"
        style={{
          textShadow: "0 2px 8px #222",
          letterSpacing: 1,
        }}
      >
        {value.to((val: number) => `${Math.round(val)}%`)}
      </animated.text>
      {/* Label */}
      <text
        x="90"
        y="98"
        textAnchor="middle"
        fontSize="1.1rem"
        fill="#aaa"
        fontWeight={500}
        letterSpacing={1}
      >
        Risk
      </text>
    </svg>
  );
}

function TrainingProgressTable() {
  // Example static data; replace with API call if available
  const jobs = [
    {
      name: "LSTM (Flood)",
      status: "Running",
      progress: 0.72,
      epoch: 18,
      totalEpochs: 25,
    },
    {
      name: "YOLOv8 (Object Detection)",
      status: "Queued",
      progress: 0.0,
      epoch: 0,
      totalEpochs: 50,
    },
    {
      name: "XGBoost (Health)",
      status: "Completed",
      progress: 1.0,
      epoch: 30,
      totalEpochs: 30,
    },
    {
      name: "GRU (Seismic)",
      status: "Running",
      progress: 0.41,
      epoch: 10,
      totalEpochs: 24,
    },
  ];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Model</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Epoch</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.name}>
            <TableCell>{job.name}</TableCell>
            <TableCell>
              <Badge
                className={
                  job.status === "Completed"
                    ? "bg-green-500 text-white"
                    : job.status === "Running"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 text-white"
                }
              >
                {job.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="w-32 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${
                    job.status === "Completed"
                      ? "bg-green-500"
                      : job.status === "Running"
                      ? "bg-blue-500 animate-pulse"
                      : "bg-gray-400"
                  }`}
                  style={{ width: `${Math.round(job.progress * 100)}%` }}
                />
              </div>
              <span className="ml-2 text-xs text-muted-foreground">
                {Math.round(job.progress * 100)}%
              </span>
            </TableCell>
            <TableCell>
              {job.epoch} / {job.totalEpochs}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TrainingMetricsChart() {
  // Example static data; replace with API call if available
  const data = [
    { epoch: 1, accuracy: 0.62, loss: 1.2 },
    { epoch: 2, accuracy: 0.68, loss: 1.0 },
    { epoch: 3, accuracy: 0.73, loss: 0.85 },
    { epoch: 4, accuracy: 0.77, loss: 0.7 },
    { epoch: 5, accuracy: 0.81, loss: 0.6 },
    { epoch: 6, accuracy: 0.84, loss: 0.52 },
    { epoch: 7, accuracy: 0.87, loss: 0.45 },
    { epoch: 8, accuracy: 0.89, loss: 0.39 },
    { epoch: 9, accuracy: 0.91, loss: 0.34 },
    { epoch: 10, accuracy: 0.92, loss: 0.3 },
  ];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="epoch"
          label={{
            value: "Epoch",
            position: "insideBottomRight",
            offset: 0,
          }}
        />
        <YAxis
          yAxisId="left"
          domain={[0, 1]}
          tickFormatter={(v) => `${Math.round(v * 100)}%`}
        />
        <YAxis yAxisId="right" orientation="right" domain={[0, 2]} hide />
        <Tooltip />
        <Bar yAxisId="left" dataKey="accuracy" fill="#6366f1" name="Accuracy" />
        <Bar yAxisId="right" dataKey="loss" fill="#f43f5e" name="Loss" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// SimulationTab component for the simulation tab
const SimulationTab = () => {
  // Dynamically require Leaflet and get Icon from the module (with type safety)
  let nodeIcon: any = undefined,
    triggeredIcon: any = undefined,
    droneIcon: any = undefined;
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const leaflet = require("leaflet");
    const LeafletIcon = leaflet.Icon;
    if (!LeafletIcon) throw new Error("Leaflet Icon class not found");
    nodeIcon = new LeafletIcon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/6832/6832382.png",
      iconSize: [41, 41],
      iconAnchor: [16, 48],
    });
    triggeredIcon = new LeafletIcon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/4479/4479159.png",
      iconSize: [41, 41],
    });
    droneIcon = new LeafletIcon({
      iconUrl:
        "https://static-00.iconduck.com/assets.00/uav-quadcopter-icon-2048x2048-6cgkinkj.png",
      iconSize: [20, 20],
      iconAnchor: [24, 24],
    });
  }

  const [nodes, setNodes] = useState(
    Array(25)
      .fill(0)
      .map((_, i) => ({
        id: i,
        lat: 3.139 + (Math.random() - 0.5) * 0.18, // larger spread
        lng: 101.6869 + (Math.random() - 0.5) * 0.28,
        triggered: false,
        prediction: Math.random().toFixed(2),
        battery: Math.floor(Math.random() * 40) + 60, // 60-100%
        signal: Math.floor(Math.random() * 40) + 60, // 60-100%
        temp: (25 + Math.random() * 10).toFixed(1),
        humidity: (50 + Math.random() * 30).toFixed(1),
        // type: "ground", // all ground
      }))
  );
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [calling, setCalling] = useState(false);
  const [modelsProcessed, setModelsProcessed] = useState<string[]>([]);
  const [streaming, setStreaming] = useState(true);
  const [drones, setDrones] = useState([
    {
      id: 1,
      pos: [3.139, 101.6269] as [number, number],
      angle: 0,
      phase: 0,
      direction: Math.random() > 0.5 ? 1 : -1,
      speed: 0.001 + Math.random() * 0.01,
    },
    {
      id: 2,
      pos: [3.129, 101.6798] as [number, number],
      angle: 0,
      phase: Math.PI / 2,
      direction: Math.random() > 0.5 ? 1 : -1,
      speed: 0.001 + Math.random() * 0.01,
    },
    {
      id: 3,
      pos: [3.129, 101.6969] as [number, number],
      angle: 0,
      phase: Math.PI,
      direction: Math.random() > 0.5 ? 1 : -1,
      speed: 0.001 + Math.random() * 0.01,
    },
    {
      id: 4,
      pos: [3.139, 101.6569] as [number, number],
      angle: 0,
      phase: 0,
      direction: Math.random() > 0.5 ? 1 : -1,
      speed: 0.001 + Math.random() * 0.01,
    },
  ]);
  const [activeDrone, setActiveDrone] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [segmentationMode, setSegmentationMode] = useState(false);
  const segmenterRef = useRef<ImageSegmenter | null>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | undefined>(undefined);
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [callDuration, setCallDuration] = useState<string>("00:00:00");

  // Model processing simulation
  useEffect(() => {
    if (
      nodes.filter((n) => n.triggered).length > 3 &&
      modelsProcessed.length < sampleModels.length
    ) {
      const timer = setTimeout(() => {
        setModelsProcessed((prev) => [
          ...prev,
          sampleModels[prev.length].endpoint,
        ]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [nodes, modelsProcessed]);

  // Fetch available video input devices (webcams)
  useEffect(() => {
    async function getCameras() {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setAvailableCameras(videoInputs);
        if (!selectedCameraId && videoInputs.length > 0) {
          setSelectedCameraId(videoInputs[0].deviceId);
        }
      }
    }
    getCameras();
  }, []);

  // VIDEO REF FIX: Use useRef and useEffect for media stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (streaming && videoRef.current && selectedCameraId) {
      navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedCameraId } }).then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } else if (!streaming && videoRef.current) {
      if (videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [streaming, selectedCameraId]);

  // Add multiple drone flying animations (figure-eight path for more coverage, random direction and speed)
  useEffect(() => {
    const radiusLat = 0.07;
    const radiusLng = 0.12;
    const center = [3.139, 101.6869];
    let tick = 0;
    const interval = setInterval(() => {
      setDrones((prev) =>
        prev.map((drone) => {
          // Occasionally randomize direction and speed
          let direction = drone.direction;
          let speed = drone.speed;
          if (tick % 50 === 0) {
            // every ~5 seconds
            direction = Math.random() > 0.5 ? 1 : -1;
            speed = 0.001;
          }
          const newAngle = drone.angle + direction * speed;
          return {
            ...drone,
            direction,
            speed,
            angle: newAngle,
            pos: [
              center[0] + radiusLat * Math.sin(newAngle + drone.phase),
              center[1] +
                radiusLng *
                  Math.sin(newAngle + drone.phase) *
                  Math.cos(newAngle + drone.phase),
            ],
          };
        })
      );
      tick++;
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Human object detection and segmentation overlay
  useEffect(() => {
    let model: cocoSsd.ObjectDetection | null = null;
    let animationId: number;
    let isMounted = true;
    async function runDetection() {
      if (!videoRef.current || !canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      if (!segmentationMode) {
        // Detection mode (boxes)
        if (!model) model = await cocoSsd.load();
        const detect = async () => {
          if (!isMounted || !videoRef.current || !canvasRef.current) return;
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          if (videoRef.current.readyState === 4) {
            ctx.drawImage(
              videoRef.current,
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            const predictions = await model!.detect(videoRef.current);
            predictions.forEach((pred: cocoSsd.DetectedObject) => {
              const isPerson =
                pred.class === "person" && pred.score && pred.score > 0.5;
              const isAnimal =
                [
                  "cat",
                  "dog",
                  "bird",
                  "horse",
                  "sheep",
                  "cow",
                  "elephant",
                  "bear",
                  "zebra",
                  "giraffe",
                ].includes(pred.class) &&
                pred.score &&
                pred.score > 0.5;
              if (isPerson || isAnimal) {
                ctx.strokeStyle = isPerson ? "#00FF00" : "#FFA500";
                ctx.lineWidth = 3;
                ctx.strokeRect(
                  pred.bbox[0],
                  pred.bbox[1],
                  pred.bbox[2],
                  pred.bbox[3]
                );
                ctx.font = "16px Arial";
                ctx.fillStyle = isPerson ? "#00FF00" : "#FFA500";
                ctx.fillText(
                  `${pred.class} (${Math.round((pred.score || 0) * 100)}%)`,
                  pred.bbox[0],
                  pred.bbox[1] > 20 ? pred.bbox[1] - 5 : 10
                );
              }
            });
          }
          animationId = requestAnimationFrame(detect);
        };
        detect();
      } else {
        // MediaPipe ImageSegmenter mode
        if (!segmenterRef.current) {
          const vision = await FilesetResolver.forVisionTasks(
            // CDN path for MediaPipe vision wasm/wasm-simd files
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
          );
          segmenterRef.current = await ImageSegmenter.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-assets/deeplabv3.tflite",
            },
            outputCategoryMask: true,
            runningMode: "VIDEO",
          });
        }
        const segment = async () => {
          if (!isMounted || !videoRef.current || !canvasRef.current) return;
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          if (videoRef.current.readyState === 4) {
            ctx.drawImage(
              videoRef.current,
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            // Run segmentation
            const result = await segmenterRef.current!.segmentForVideo(
              videoRef.current,
              performance.now()
            );
            if (result && result.categoryMask) {
              const mask = result.categoryMask;
const width = mask.width;
const height = mask.height;
const maskData = mask.getAsUint8Array();
const personIdx = 15;

// Create ImageData for the mask
const maskImageData = new ImageData(width, height);

// Function to apply contrast & saturation (simplified)
function applyContrastAndSaturation(r: number, g: number, b: number, contrast: number, saturation: number): [number, number, number] {
  // Contrast adjustment
  r = ((r - 128) * contrast + 128);
  g = ((g - 128) * contrast + 128);
  b = ((b - 128) * contrast + 128);

  // Saturation adjustment
  const avg = (r + g + b) / 3;
  r = avg + (r - avg) * saturation;
  g = avg + (g - avg) * saturation;
  b = avg + (b - avg) * saturation;

  return [
    Math.min(255, Math.max(0, r)),
    Math.min(255, Math.max(0, g)),
    Math.min(255, Math.max(0, b))
  ];
}

// Loop through pixels
for (let i = 0; i < maskData.length; i++) {
  const offset = i * 4;
  if (maskData[i] === personIdx) {
    // Foreground: red overlay, high contrast & saturation
    let [r, g, b] = applyContrastAndSaturation(255, 0, 0, 4.5, 2.0); // red with pop
    maskImageData.data[offset + 0] = r;
    maskImageData.data[offset + 1] = g;
    maskImageData.data[offset + 2] = b;
    maskImageData.data[offset + 3] = 250;
  } else {
    // Background: blue overlay, low contrast
    let [r, g, b] = applyContrastAndSaturation(100, 100, 0, 1005, 1220); // soft blue
    maskImageData.data[offset + 0] = r;
    maskImageData.data[offset + 1] = g;
    maskImageData.data[offset + 2] = b;
    maskImageData.data[offset + 3] = 230;
  }
}

// Draw to canvas
const offscreen = document.createElement("canvas");
offscreen.width = width;
offscreen.height = height;
offscreen.getContext("2d")!.putImageData(maskImageData, 0, 0);

ctx.drawImage(
  offscreen,
  0,
  0,
  canvasRef.current.width,
  canvasRef.current.height
);

            }
          }
          animationId = requestAnimationFrame(segment);
        };
        segment();
      }
    }
    runDetection();
    return () => {
      isMounted = false;
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [streaming, segmentationMode]);

  // Start/stop call timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (calling) {
      const start = Date.now();
      setCallStartTime(start);
      setCallDuration("00:00:00");
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
        const s = String(elapsed % 60).padStart(2, "0");
        setCallDuration(`${h}:${m}:${s}`);
      }, 1000);
    } else {
      setCallStartTime(null);
      setCallDuration("00:00:00");
    }
    return () => interval && clearInterval(interval);
  }, [calling]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-right justify-between">
              <CardTitle>Simulation Controls</CardTitle>
              <div className="flex items-center space-x-2">
                <label htmlFor="segmentation-toggle" className="text-sm">
                  Segmentation{" "}
                  <span className="font-medium">
                    {segmentationMode ? "ON" : "OFF"}
                  </span>
                </label>
                <Switch
                  id="segmentation-toggle"
                  checked={segmentationMode}
                  onCheckedChange={setSegmentationMode}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div
                className="relative w-full"
                style={{ aspectRatio: "4/3", maxWidth: 480 }}
              >
                {streaming && (
                  <>
                    <video
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                      autoPlay
                      muted
                      ref={videoRef}
                      style={{ display: "block", aspectRatio: "4/3" }}
                      onLoadedMetadata={(e) => {
                        const video = e.currentTarget;
                        if (canvasRef.current) {
                          canvasRef.current.width = video.videoWidth;
                          canvasRef.current.height = video.videoHeight;
                        }
                      }}
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-lg"
                      style={{ zIndex: 2, aspectRatio: "4/3" }}
                    />
                  </>
                )}
              </div>
                              {/* Camera selection dropdown */}
                <select
                  className="p-2 border rounded"
                  value={selectedCameraId}
                  onChange={e => setSelectedCameraId(e.target.value)}
                  style={{ width: '100%' }}
                  disabled={!availableCameras.length}
                >
                  {availableCameras.map(cam => (
                    <option key={cam.deviceId} value={cam.deviceId}>
                      {cam.label || `Camera ${cam.deviceId.slice(-4)}`}
                    </option>
                  ))}
                </select>

              <div className="flex gap-2 items-center mb-2">
                <Button onClick={() => setStreaming((prev) => !prev)}>
                  {streaming ? (
                    <>
                      <Video className="mr-2" /> Stop Camera
                    </>
                  ) : (
                    <>
                      <Video className="mr-2" /> Start Camera
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowConfirm(true)}
                >
                  Send Notifications
                </Button>
                <Button variant="destructive" onClick={() => setCalling(true)}>
                  <Phone className="mr-2" /> Emergency Call
                </Button>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium">Model Processing:</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sampleModels.map((model) => (
                    <Badge
                      key={model.endpoint}
                      className={
                        modelsProcessed.includes(model.endpoint)
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-800"
                      }
                    >
                      {model.models[0]}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Detection Grid</CardTitle>
          </CardHeader>
          <CardContent className="h-[500px] relative">
            <MapContainer
              center={[3.139, 101.6869]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {nodes.map((node) => (
                <Marker
                  key={node.id}
                  position={[node.lat, node.lng]}
                  icon={node.triggered ? triggeredIcon : nodeIcon}
                  eventHandlers={{
                    mouseover: () => setActiveNode(node.id),
                    mouseout: () => setActiveNode(null),
                  }}
                >
                  {activeNode === node.id && (
                    <Popup>
                      <div className="p-2 min-w-[160px]">
                        <p className="font-semibold">
                          Node {nodes[activeNode]?.id}
                        </p>
                        <p>
                          Prediction:{" "}
                          <span className="font-mono">
                            {nodes[activeNode]?.prediction}
                          </span>
                        </p>
                        <p>
                          Battery:{" "}
                          <span className="font-mono">
                            {nodes[activeNode]?.battery}%
                          </span>
                        </p>
                        <p>
                          Signal:{" "}
                          <span className="font-mono">
                            {nodes[activeNode]?.signal}%
                          </span>
                        </p>
                        <p>
                          Temp:{" "}
                          <span className="font-mono">
                            {nodes[activeNode]?.temp}°C
                          </span>
                        </p>
                        <p>
                          Humidity:{" "}
                          <span className="font-mono">
                            {nodes[activeNode]?.humidity}%
                          </span>
                        </p>
                      </div>
                    </Popup>
                  )}
                </Marker>
              ))}
              {/* Multiple Drone Markers */}
              {drones.map((drone) => (
                <Marker
                  key={drone.id}
                  position={drone.pos}
                  icon={droneIcon}
                  eventHandlers={{
                    mouseover: () => setActiveDrone(drone.id),
                    mouseout: () => setActiveDrone(null),
                  }}
                >
                  {activeDrone === drone.id && (
                    <Popup>
                      <div className="p-2 min-w-[120px]">
                        <p className="font-semibold">Drone {drone.id}</p>
                        <p>
                          Lat:{" "}
                          <span className="font-mono">
                            {drone.pos[0].toFixed(5)}
                          </span>
                        </p>
                        <p>
                          Lng:{" "}
                          <span className="font-mono">
                            {drone.pos[1].toFixed(5)}
                          </span>
                        </p>
                      </div>
                    </Popup>
                  )}
                </Marker>
              ))}
            </MapContainer>
          </CardContent>
        </Card>
      </div>
      {/* Notification Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="z-[1200]">
          <DialogHeader>
            <DialogTitle>Confirm Emergency Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label>Recipient Groups</label>
              <select className="w-full p-2 border rounded">
                <option>All Residents</option>
                <option>Emergency Teams</option>
                <option>Government Agencies</option>
              </select>
            </div>
            <div>
              <label>Message</label>
              <textarea
                className="w-full p-2 border rounded"
                defaultValue="Emergency detected! Please evacuate immediately!"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {/* BADGE FIX in Dialog */}
              <Badge className="bg-red-500 text-white">
                Prediction Score: {nodes[0]?.prediction}
              </Badge>
              <Badge className="bg-gray-400 text-white">
                Nodes Triggered: {nodes.filter((n) => n.triggered).length}
              </Badge>
              <Badge className="bg-blue-500 text-white">
                Models Processed: {modelsProcessed.length}
              </Badge>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                alert("Notifications sent!");
                setShowConfirm(false);
              }}
            >
              Confirm Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Calling Interface */}
      {calling && (
        <div className="fixed bottom-4 right-4 p-4 bg-card rounded-lg shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Phone className="text-red-500 animate-pulse" />
            <div>
              <h3 className="font-medium">Emergency Call</h3>
              <div className="text-sm text-muted-foreground">
                Duration: {callDuration}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full">
              <div
                className="h-2 bg-red-500 rounded-full animate-soundwave"
                style={{ width: `${Math.random() * 100}%` }}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCalling(false)}>
                End Call
              </Button>
              <select className="p-2 border rounded">
                <option>Firefighter</option>
                <option>Police</option>
                <option>Hospital</option>
                <option>Rescue Team</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
