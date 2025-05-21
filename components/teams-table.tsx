"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Users } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

export function TeamsTable() {
  const router = useRouter()
  const { toast } = useToast()
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const supabaseService = new SupabaseService()
        const data = await supabaseService.getTeams()
        setTeams(data)
      } catch (error) {
        console.error("Error fetching teams:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load teams. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [toast])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this team? This action cannot be undone.")) return
    setDeletingId(id)
    try {
      const supabaseService = new SupabaseService()
      await supabaseService.deleteTeam(id)
      setTeams((prev) => prev.filter((t) => t.id !== id))
      toast({
        title: "Team deleted",
        description: "The team has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting team:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete team. Please try again.",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/teams/${id}/edit`)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Teams</CardTitle>
          <CardDescription>Loading teams...</CardDescription>
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
        <CardTitle>Teams</CardTitle>
        <CardDescription>Manage field teams and personnel.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Leader</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No teams found
                </TableCell>
              </TableRow>
            ) : (
              teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{team.leader_name?.charAt(0) || "L"}</AvatarFallback>
                      </Avatar>
                      <span>{team.leader_name || "Unknown"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{team.members?.length || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatRelativeTime(team.created_at)}</TableCell>
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
                        <DropdownMenuItem onClick={() => router.push(`/teams/${team.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(team.id)}>
                          Edit Team
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(team.id)} disabled={deletingId === team.id}>
                          {deletingId === team.id ? "Deleting..." : "Delete Team"}
                        </DropdownMenuItem>
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
