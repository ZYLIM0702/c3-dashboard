import type { Metadata } from "next"

import { SettingsForm } from "@/components/settings-form"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export const metadata: Metadata = {
  title: "Settings | C3 Dashboard",
  description: "Manage your account and system settings",
}

export default async function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" description="Manage your account and system settings." />
      <div className="grid gap-4">
        <SettingsForm />
      </div>
    </DashboardShell>
  )
}
