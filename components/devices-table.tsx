"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Battery,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  MoreHorizontal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
} from "lucide-react"

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

interface DevicesTableProps {
  filterType?: string
}

export function DevicesTable({ filterType }: DevicesTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const supabaseService = new SupabaseService()
        let data

        if (filterType) {
          data = await supabaseService.getDevicesByType(filterType)
        } else {
          data = await supabaseService.getDevices()
        }

        setDevices(data)
      } catch (error) {
        console.error("Error fetching devices:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load devices. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDevices()
  }, [toast, filterType])

  // Rest of the component remains the same...

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 capitalize">
            {status}
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 capitalize">
            {status}
          </Badge>
        )
      case "maintenance":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 capitalize">
            {status}
          </Badge>
        )
      case "alert":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 capitalize">
            {status}
          </Badge>
        )
      case "offline":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 capitalize">
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

  const getDeviceTypeBadge = (type: string) => {
    const typeMap: Record<string, string> = {
      ground_node: "Ground Node",
      marine_buoy: "Marine Buoy",
      wearable: "Wearable",
      drone: "Drone",
      seh: "Smart Helmet",
      lora_module: "LoRa Module",
      custom: "Custom Device",
    }

    return (
      <Badge variant="secondary" className="capitalize">
        {typeMap[type] || type}
      </Badge>
    )
  }

  const getBatteryIcon = (level: number) => {
    if (level === 0) return <BatteryWarning className="h-4 w-4 text-gray-500" />
    if (level < 20) return <BatteryLow className="h-4 w-4 text-red-500" />
    if (level < 50) return <BatteryMedium className="h-4 w-4 text-yellow-500" />
    if (level < 80) return <Battery className="h-4 w-4 text-green-500" />
    return <BatteryFull className="h-4 w-4 text-green-500" />
  }

  const getSignalIcon = (strength: number) => {
    if (strength === 0) return <SignalZero className="h-4 w-4 text-gray-500" />
    if (strength < 30) return <SignalLow className="h-4 w-4 text-red-500" />
    if (strength < 70) return <SignalMedium className="h-4 w-4 text-yellow-500" />
    return <SignalHigh className="h-4 w-4 text-green-500" />
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Devices</CardTitle>
          <CardDescription>Loading devices...</CardDescription>
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
        <CardTitle>Devices {filterType ? `- ${getDeviceTypeBadge(filterType).props.children}` : ""}</CardTitle>
        <CardDescription>Manage and monitor all connected devices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Battery</TableHead>
              <TableHead>Signal</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No devices found
                </TableCell>
              </TableRow>
            ) : (
              devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>{getDeviceTypeBadge(device.type)}</TableCell>
                  <TableCell>{getStatusBadge(device.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getBatteryIcon(device.battery_level)}
                      <span>{device.battery_level}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSignalIcon(device.signal_strength)}
                      <span>{device.signal_strength}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatRelativeTime(device.last_seen)}</TableCell>
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
                        <DropdownMenuItem onClick={() => router.push(`/devices/${device.type}/${device.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/devices/${device.type}/${device.id}/analytics`)}>
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit Device</DropdownMenuItem>
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
