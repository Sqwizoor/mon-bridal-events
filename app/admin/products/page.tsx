"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import AdminProductsTab from "@/components/admin/AdminProductsTab";

export default function ProductsPage() {
  const productStats = useQuery(api.products.getStats);
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-amber-900">Jewelry Shop</h1>
          <p className="text-muted-foreground mt-1">
            Manage your jewelry inventory and sales catalog
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/products/create")}
          className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Jewelry Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-amber-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jewelry</CardTitle>
            <Package className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productStats?.jewelryCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Available for sale</p>
          </CardContent>
        </Card>
        
        <Card className="border-amber-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Items</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productStats?.activeProducts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Visible in shop</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productStats?.lowStock || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Items needing restock</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-100 shadow-sm">
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>
            Manage item pricing, visibility, and stock levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminProductsTab initialCategory="jewelry" />
        </CardContent>
      </Card>
    </div>
  );
}
