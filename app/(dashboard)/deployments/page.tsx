import type { Metadata } from "next"

import { DeploymentsTable } from "@/components/deployments-table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Deployments | C3 Dashboard",
  description: "Manage field deployments and operations",
}

export default async function DeploymentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Deployments" description="Manage field deployments and operations.">
        <Link href="/deployments/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Deployment
          </Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-4">
        <DeploymentsTable />
      </div>
    </DashboardShell>
  )
}
