import type { Metadata } from "next"

import { DevicesTable } from "@/components/devices-table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Devices | C3 Dashboard",
  description: "Manage and monitor all connected devices",
}

export default async function DevicesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Devices" description="Manage and monitor all connected devices.">
        <Link href="/devices/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-4">
        <DevicesTable />
      </div>
    </DashboardShell>
  )
}
