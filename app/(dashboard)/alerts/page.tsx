import type { Metadata } from "next"

import { AlertsTable } from "@/components/alerts-table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export const metadata: Metadata = {
  title: "Alerts | C3 Dashboard",
  description: "Manage and monitor system alerts",
}

export default async function AlertsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Alerts" description="Monitor and manage system alerts." />
      <div className="grid gap-4">
        <AlertsTable />
      </div>
    </DashboardShell>
  )
}
