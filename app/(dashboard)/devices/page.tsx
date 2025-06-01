'use client'
import React, { useEffect, useState } from "react"
import { DevicesTable } from "@/components/devices-table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { LoraMeshSimulator } from "@/components/lora-mesh-simulator"

export default function DevicesPage() {
  const [mlSummary, setMlSummary] = useState({ atRisk: 0, total: 0 })
  const [loraStatus, setLoraStatus] = useState<string>("")

  // Fetch ML analytics summary from ML microservice
  useEffect(() => {
    async function fetchMLSummary() {
      try {
        const res = await fetch("http://localhost:8001/predict/health", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ heart_rate: [80, 82, 85], spo2: [98, 97, 99], meta: {} }),
        })
        const data = await res.json()
        setMlSummary({ atRisk: data.risk > 0.7 ? 1 : 0, total: 1 })
      } catch (e) {
        setMlSummary({ atRisk: 0, total: 0 })
      }
    }
    fetchMLSummary()
  }, [])

  // Simulate LoRa data transfer
  const handleSimulateLora = () => {
    setLoraStatus("Transferring data over LoRa...")
    setTimeout(() => {
      setLoraStatus("LoRa data transfer successful! (Simulated)")
    }, 1500)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Devices" description="Manage and monitor all connected devices.">
        <Link href="/devices/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </Link>
      </DashboardHeader>
      {/* ML Analytics Summary Card */}
      <div className="grid gap-4 mb-2">
        <div className="rounded-md border bg-card p-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold">ML Analytics Summary</div>
            <div className="text-sm text-muted-foreground">AI-powered risk and anomaly detection for all devices</div>
          </div>
          <div className="mt-2 md:mt-0 flex gap-4 items-center">
            <span className="text-2xl font-bold text-destructive">{mlSummary.atRisk}</span>
            <span className="text-sm text-muted-foreground">at-risk devices</span>
            <span className="mx-2 text-border">|</span>
            <span className="text-2xl font-bold text-foreground">{mlSummary.total}</span>
            <span className="text-sm text-muted-foreground">total devices</span>
          </div>
        </div>
      </div>
      {/* LoRa Mesh Simulation */}
      <LoraMeshSimulator />
      <div className="grid gap-4">
        <DevicesTable />
      </div>
    </DashboardShell>
  )
}
