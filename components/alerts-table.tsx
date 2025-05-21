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

export function AlertsTable() {
  const router = useRouter()
  const { toast } = useToast()
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const supabaseService = new SupabaseService()
        const data = await supabaseService.getAlerts()
        setAlerts(data)
      } catch (error) {
        console.error("Error fetching alerts:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load alerts. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [toast])

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "info":
        return <Info className="h-4 w-4 text-info" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge variant="destructive" className="capitalize">
            {severity}
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="warning" className="capitalize">
            {severity}
          </Badge>
        )
      case "info":
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
      case "acknowledged":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 capitalize">
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

  const handleAcknowledge = async (id: string) => {
    try {
      const supabaseService = new SupabaseService()
      await supabaseService.updateAlertStatus(id, "acknowledged")

      setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, status: "acknowledged" } : alert)))

      toast({
        title: "Alert acknowledged",
        description: "The alert has been acknowledged successfully.",
      })
    } catch (error) {
      console.error("Error acknowledging alert:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to acknowledge alert. Please try again.",
      })
    }
  }

  const handleResolve = async (id: string) => {
    try {
      const supabaseService = new SupabaseService()
      await supabaseService.updateAlertStatus(id, "resolved")

      setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, status: "resolved" } : alert)))

      toast({
        title: "Alert resolved",
        description: "The alert has been resolved successfully.",
      })
    } catch (error) {
      console.error("Error resolving alert:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resolve alert. Please try again.",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>Loading alerts...</CardDescription>
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
        <CardTitle>Alerts</CardTitle>
        <CardDescription>Manage and respond to system alerts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Severity</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No alerts found
                </TableCell>
              </TableRow>
            ) : (
              alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(alert.severity)}
                      {getSeverityBadge(alert.severity)}
                    </div>
                  </TableCell>
                  <TableCell>{alert.title}</TableCell>
                  <TableCell>{getStatusBadge(alert.status)}</TableCell>
                  <TableCell>{formatRelativeTime(alert.created_at)}</TableCell>
                  <TableCell>{formatRelativeTime(alert.updated_at)}</TableCell>
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
                        <DropdownMenuItem onClick={() => router.push(`/alerts/${alert.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        {alert.status === "active" && (
                          <DropdownMenuItem onClick={() => handleAcknowledge(alert.id)}>Acknowledge</DropdownMenuItem>
                        )}
                        {(alert.status === "active" || alert.status === "acknowledged") && (
                          <DropdownMenuItem onClick={() => handleResolve(alert.id)}>Resolve</DropdownMenuItem>
                        )}
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
