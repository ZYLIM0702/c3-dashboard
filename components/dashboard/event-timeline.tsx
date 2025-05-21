import { AlertTriangle, Battery, Cpu, Radio, Waves } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getEvents } from "@/lib/supabase-service"

export async function EventTimeline() {
  const events = await getEvents(undefined, 5)

  return (
    <div className="space-y-8">
      {events.map((event) => {
        // Determine icon based on event type
        let Icon = Cpu
        let iconColorClass = "bg-blue-100 text-blue-600"

        if (event.type === "earthquake") {
          Icon = AlertTriangle
          iconColorClass = "bg-red-100 text-red-600"
        } else if (event.type === "flood") {
          Icon = Waves
          iconColorClass = "bg-red-100 text-red-600"
        } else if (event.type === "device" && event.title.includes("Battery")) {
          Icon = Battery
          iconColorClass = "bg-yellow-100 text-yellow-600"
        } else if (event.type === "device" && event.title.includes("Added")) {
          Icon = Radio
          iconColorClass = "bg-green-100 text-green-600"
        }

        // Determine badge variant based on severity
        const badgeVariant =
          event.severity === "critical"
            ? "destructive"
            : event.severity === "high"
              ? "destructive"
              : event.severity === "medium"
                ? "warning"
                : "outline"

        return (
          <div key={event.id} className="flex">
            <div className="flex flex-col items-center mr-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${iconColorClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="w-px h-full bg-gray-300 mt-2"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{event.title}</h3>
                <Badge variant={badgeVariant}>{event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
              <div className="mt-1 text-xs text-muted-foreground">
                {new Date(event.started_at).toLocaleTimeString()} - {new Date(event.started_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
