import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function RecentAlerts() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">Critical</Badge>
            <h3 className="font-semibold">Seismic Activity Detected</h3>
          </div>
          <Button size="sm" variant="outline">
            View
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Ground Node G-001 detected unusual vibrations.</p>
        <div className="mt-2 text-xs text-muted-foreground">10 minutes ago</div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">Critical</Badge>
            <h3 className="font-semibold">Flood Warning</h3>
          </div>
          <Button size="sm" variant="outline">
            View
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Marine Buoy M-002 detected rapid water level rise.</p>
        <div className="mt-2 text-xs text-muted-foreground">25 minutes ago</div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="warning">Warning</Badge>
            <h3 className="font-semibold">Battery Low</h3>
          </div>
          <Button size="sm" variant="outline">
            View
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Marine Buoy M-003 battery level at 15%.</p>
        <div className="mt-2 text-xs text-muted-foreground">30 minutes ago</div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Info</Badge>
            <h3 className="font-semibold">System Update Available</h3>
          </div>
          <Button size="sm" variant="outline">
            View
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">New firmware v2.3.1 ready to install.</p>
        <div className="mt-2 text-xs text-muted-foreground">2 hours ago</div>
      </div>
    </div>
  )
}
