import { AlertTriangle, Battery, Cpu, Radio, Waves } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function EventTimeline() {
  return (
    <div className="space-y-8">
      <div className="flex">
        <div className="flex flex-col items-center mr-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="w-px h-full bg-gray-300 mt-2"></div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Critical Alert: Seismic Activity</h3>
            <Badge variant="destructive">Critical</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Ground Node G-001 detected unusual vibrations.</p>
          <div className="mt-1 text-xs text-muted-foreground">10 minutes ago</div>
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col items-center mr-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
            <Waves className="h-5 w-5" />
          </div>
          <div className="w-px h-full bg-gray-300 mt-2"></div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Critical Alert: Flood Warning</h3>
            <Badge variant="destructive">Critical</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Marine Buoy M-002 detected rapid water level rise.</p>
          <div className="mt-1 text-xs text-muted-foreground">25 minutes ago</div>
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col items-center mr-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600">
            <Battery className="h-5 w-5" />
          </div>
          <div className="w-px h-full bg-gray-300 mt-2"></div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Warning: Battery Low</h3>
            <Badge variant="warning">Warning</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Marine Buoy M-003 battery level at 15%.</p>
          <div className="mt-1 text-xs text-muted-foreground">30 minutes ago</div>
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col items-center mr-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="w-px h-full bg-gray-300 mt-2"></div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">System Update Available</h3>
            <Badge variant="outline">Info</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">New firmware v2.3.1 ready to install for all devices.</p>
          <div className="mt-1 text-xs text-muted-foreground">2 hours ago</div>
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col items-center mr-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
            <Radio className="h-5 w-5" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">New Device Added</h3>
            <Badge variant="outline">Info</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Ground Node G-043 has been registered and is now active.</p>
          <div className="mt-1 text-xs text-muted-foreground">4 hours ago</div>
        </div>
      </div>
    </div>
  )
}
