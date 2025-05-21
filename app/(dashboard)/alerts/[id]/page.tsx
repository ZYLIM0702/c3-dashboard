import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { SupabaseService } from "@/services/supabase-service";
import { formatRelativeTime } from "@/lib/utils";

export default async function AlertDetailPage({ params }: { params: { id: string } }) {
  const supabaseService = new SupabaseService();
  const alert = await supabaseService.getAlertById(params.id);

  if (!alert) return notFound();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{alert.title}</CardTitle>
          <CardDescription>
            <span className="mr-2">Severity:</span>
            <Badge variant={
              alert.severity === "critical"
                ? "destructive"
                : alert.severity === "warning"
                  ? "warning"
                  : alert.severity === "info"
                    ? "info"
                    : "outline"
            } className="capitalize">
              {alert.severity}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="font-semibold">Status:</span> {alert.status}
          </div>
          <div>
            <span className="font-semibold">Description:</span> {alert.description}
          </div>
          <div>
            <span className="font-semibold">Created:</span> {formatRelativeTime(alert.created_at)}
          </div>
          <div>
            <span className="font-semibold">Updated:</span> {formatRelativeTime(alert.updated_at)}
          </div>
          <div>
            <Button variant="outline" asChild>
              <a href="/alerts">Back to Alerts</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
