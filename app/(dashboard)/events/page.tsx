import type { Metadata } from "next"

import { EventsTable } from "@/components/events-table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export const metadata: Metadata = {
  title: "Events | C3 Dashboard",
  description: "Monitor system events and incidents",
}

export default async function EventsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Events" description="Monitor system events and incidents." />
      <div className="grid gap-4">
        <EventsTable />
      </div>
    </DashboardShell>
  )
}
