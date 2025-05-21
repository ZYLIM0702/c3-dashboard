import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { DatabaseExplorer } from "@/components/database-explorer"

export const metadata: Metadata = {
  title: "Database | C3 Dashboard",
  description: "Explore and manage the system database",
}

export default async function DatabasePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Database" description="Explore and manage the system database." />
      <div className="grid gap-4">
        <DatabaseExplorer />
      </div>
    </DashboardShell>
  )
}
