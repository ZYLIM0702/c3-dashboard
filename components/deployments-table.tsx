"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Users, Laptop } from "lucide-react"

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
import { SupabaseService } from "@/services/supabase-service"

export function DeploymentsTable() {
  const router = useRouter()
  const { toast } = useToast()
  const [deployments, setDeployments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const supabaseService = new SupabaseService()
        const data = await supabaseService.getDeployments()
        setDeployments(data)
      } catch (error) {
        console.error("Error fetching deployments:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load deployments. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDeployments()
  }, [toast])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 capitalize">
            {status}
          </Badge>
        )
      case "planned":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 capitalize">
            {status}
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 capitalize">
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deployments</CardTitle>
          <CardDescription>Loading deployments...</CardDescription>
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
        <CardTitle>Deployments</CardTitle>
        <CardDescription>Manage field deployments and operations.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead>Devices</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deployments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No deployments found
                </TableCell>
              </TableRow>
            ) : (
              deployments.map((deployment) => (
                <TableRow key={deployment.id}>
                  <TableCell className="font-medium">{deployment.name}</TableCell>
                  <TableCell>{getStatusBadge(deployment.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{deployment.teams?.length || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4" />
                      <span>{deployment.devices?.length || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(deployment.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {deployment.end_date ? new Date(deployment.end_date).toLocaleDateString() : "Ongoing"}
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => router.push(`/deployments/${deployment.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Deployment</DropdownMenuItem>
                        {deployment.status === "active" && <DropdownMenuItem>Complete Deployment</DropdownMenuItem>}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete Deployment</DropdownMenuItem>
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
