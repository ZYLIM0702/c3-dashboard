import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAlerts } from "@/lib/supabase-service"

export async function RecentAlerts() {
  const alerts = await getAlerts("active", 4)

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  alert.severity === "critical" ? "destructive" : alert.severity === "warning" ? "warning" : "outline"
                }
              >
                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
              </Badge>
              <h3 className="font-semibold">{alert.title}</h3>
            </div>
            <Button size="sm" variant="outline">
              View
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{alert.description}</p>
          <div className="mt-2 text-xs text-muted-foreground">
            {new Date(alert.created_at).toLocaleTimeString()} - {new Date(alert.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}
