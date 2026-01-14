"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import HiringItemForm from "@/components/admin/HiringItemForm";

export default function CreateHiringItemPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-purple-900">Add Hiring Item</h1>
          <p className="text-muted-foreground mt-1">
            Add a new item to your event hiring catalog
          </p>
        </div>
      </div>

      <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle>Item Details</CardTitle>
          </div>
          <CardDescription>Fill in the specifications for event hire</CardDescription>
        </CardHeader>
        <CardContent>
          <HiringItemForm onSuccess={() => router.push("/admin/hiring-items")} />
        </CardContent>
      </Card>
    </div>
  );
}
