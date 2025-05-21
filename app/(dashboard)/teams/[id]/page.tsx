import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { SupabaseService } from "@/services/supabase-service";

export default async function TeamDetailPage({ params }: { params: { id: string } }) {
  const supabaseService = new SupabaseService();
  // You need to implement getTeamById in your SupabaseService
  const team = await supabaseService.getTeamById?.(params.id);

  if (!team) return notFound();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{team.name}</CardTitle>
          <CardDescription>Team details and members.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="font-semibold">Leader:</span> {team.leader_name || 'N/A'}
          </div>
          <div>
            <span className="font-semibold">Created:</span> {team.created_at ? new Date(team.created_at).toLocaleString() : 'N/A'}
          </div>
          <div>
            <Button variant="outline" asChild>
              <a href="/teams">Back to Teams</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
