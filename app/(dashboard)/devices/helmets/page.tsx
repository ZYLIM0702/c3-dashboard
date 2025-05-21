import { DevicesTable } from "@/components/devices-table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function HelmetsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Smart Helmets" description="Manage and monitor smart helmet devices.">
        <Link href="/devices/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Smart Helmet
          </Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-4">
        <DevicesTable filterType="seh" />
      </div>
    </DashboardShell>
  )
}
