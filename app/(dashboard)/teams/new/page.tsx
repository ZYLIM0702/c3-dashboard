"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function AddTeamPage() {
  // This is a placeholder. You can add a form and logic as needed.
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Add New Team</CardTitle>
          <CardDescription>Register a new field team for deployment and coordination.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Team Name" className="w-full" />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="button" disabled>
              Save (Demo Only)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
