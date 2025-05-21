import type { Metadata } from "next"

import { TeamsTable } from "@/components/teams-table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Teams | C3 Dashboard",
  description: "Manage field teams and personnel",
}

export default async function TeamsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Teams" description="Manage field teams and personnel.">
        <Link href="/teams/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Team
          </Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-4">
        <TeamsTable />
      </div>
    </DashboardShell>
  )
}
