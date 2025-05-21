"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { SupabaseService } from "@/services/supabase-service"

export default function EditTeamPage() {
  const router = useRouter()
  const params = useParams() as { id: string }
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [team, setTeam] = useState<any>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const supabaseService = new SupabaseService()
        const data = await supabaseService.getTeamById(params.id)
        setTeam(data)
        setName(data.name || "")
        setDescription(data.description || "")
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load team details.",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const supabaseService = new SupabaseService()
      await supabaseService.updateTeam(params.id, { name, description })
      toast({ title: "Team updated", description: "Team details have been updated." })
      router.push("/teams")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update team.",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh]">Loading...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Edit Team</CardTitle>
          <CardDescription>Update team details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block font-semibold mb-1">Description</label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => router.push("/teams")}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
