"use client";
import React, { useEffect, useState } from "react";
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
} from "recharts";
import { useSpring, animated } from "react-spring";
// Dynamically import MapContainer and related components to avoid SSR errors
import dynamic from "next/dynamic";
const DynamicMap = dynamic(() => import("./MapSensingClient"), { ssr: false });

const sampleModels = [
  {
    endpoint: "/predict/seismic",
    models: ["QuakeFlow", "LSTM"],
  },
  { endpoint: "/predict/flood", models: ["LSTM", "GRU", "XGBoost"] },
  { endpoint: "/predict/object-detect", models: ["YOLOv5/v8"] },
  { endpoint: "/predict/health", models: ["LSTM", "Autoencoder", "XGBoost"] },
  { endpoint: "/predict/llm-rescue", models: ["Phi-2", "TinyLLaMA"] }
];

export default function MachineLearningAnalyticsPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [mlResults, setMlResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [simulation, setSimulation] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function fetchDevices() {
      try {
        const supabaseService = new SupabaseService();
        const data = await supabaseService.getDevices();
        setDevices(
          data.map((device) => ({
            ...device,
            ...(simulation
              ? {
                  heart_rate: Math.floor(Math.random() * 60) + 60,
                  spo2: Math.floor(Math.random() * 15) + 85,
                }
              : {}),
          }))
        );
      } catch {
        setDevices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDevices();
  }, [simulation]);

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
    if (simulation) {
      const interval = setInterval(fetchML, 3000);
      return () => clearInterval(interval);
    }
  }, [devices, simulation]);

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

  return (
    <div className="p-4 bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Machine Learning Analytics</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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
              <DynamicMap />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 flex flex-col items-center justify-center">
            <CardHeader className="w-full">
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="90%" height="100%">
                <BarChart data={chartData} style={{ margin: '0 auto' }}>
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

          
        </TabsContent>

      </Tabs>

      <div className="flex justify-end mt-4">
        <Button
          variant={simulation ? "destructive" : "outline"}
          onClick={() => setSimulation(!simulation)}
        >
          {simulation ? "Stop Simulation" : "Start Simulation"}
        </Button>
      </div>
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
