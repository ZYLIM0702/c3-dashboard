import { DevicesTable } from "@/components/devices-table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function WearablesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Wearables" description="Manage and monitor wearable devices.">
        <Link href="/devices/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Wearable
          </Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-4">
        <DevicesTable filterType="wearable" />
      </div>
    </DashboardShell>
  )
}
