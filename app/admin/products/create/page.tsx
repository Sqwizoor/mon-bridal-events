"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default function CreateProductPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Create New Product</h1>
          <p className="text-muted-foreground mt-1">
            Add a new product to your catalog
          </p>
        </div>
      </div>

      <Card className="border-amber-200 dark:border-amber-800 bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Fill in the details for your new product</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm onSuccess={() => router.push("/admin/products")} />
        </CardContent>
      </Card>
    </div>
  );
}
