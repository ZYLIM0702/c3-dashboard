"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, AlertTriangle, Bell, Info, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { formatRelativeTime } from "@/lib/utils"
import { SupabaseService } from "@/services/supabase-service"

export function EventsTable() {
  const router = useRouter()
  const { toast } = useToast()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const supabaseService = new SupabaseService()
        const data = await supabaseService.getEvents()
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load events. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [toast])

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "low":
        return <Info className="h-4 w-4 text-info" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return (
          <Badge variant="destructive" className="capitalize">
            {severity}
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="warning" className="capitalize">
            {severity}
          </Badge>
        )
      case "low":
        return (
          <Badge variant="info" className="capitalize">
            {severity}
          </Badge>
        )
      default:
        return <Badge className="capitalize">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 capitalize">
            {status}
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 capitalize">
            {status}
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="capitalize">
            {status}
          </Badge>
        )
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "system":
        return (
          <Badge variant="secondary" className="capitalize">
            {type}
          </Badge>
        )
      case "device":
        return (
          <Badge variant="secondary" className="capitalize">
            {type}
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="capitalize">
            {type}
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>Loading events...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events</CardTitle>
        <CardDescription>Monitor system events and incidents.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Ended</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No events found
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{getTypeBadge(event.type)}</TableCell>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(event.severity)}
                      {getSeverityBadge(event.severity)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell>{formatRelativeTime(event.started_at)}</TableCell>
                  <TableCell>{event.ended_at ? formatRelativeTime(event.ended_at) : "Ongoing"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/events/${event.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        {event.status === "active" && <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
