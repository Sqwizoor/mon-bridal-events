"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";
import {
  Package,
  ShoppingCart,
  Calendar,
  TrendingUp,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { getToken } = useAuth();
  const productStats = useQuery(api.products.getStats);
  const orderStats = useQuery(api.orders.getStats);
  const hireStats = useQuery(api.hireRequests.getStats);
  const seedCategories = useMutation(api.categories.seedDecorCategories);
  const setAdmin = useMutation(api.users.setAdmin);

  const handleSeedCategories = async () => {
    try {
      await seedCategories();
      toast.success("Categories seeded successfully!");
    } catch (error) {
      toast.error("Failed to seed categories");
    }
  };

  const handleSetAdmin = async () => {
    try {
      const result = await setAdmin();
      toast.success(result + " - Please refresh the page");
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error("Failed to set admin role");
    }
  };

  const checkAuth = async () => {
    try {
      const token = await getToken({ template: "convex" });
      console.log("🔑 Clerk Token:", token ? "EXISTS" : "NULL");
      if (token) {
        toast.success("Auth token exists! Try creating a product now.");
      } else {
        toast.error("No auth token! Please sign out and sign back in.");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      toast.error("Auth check failed - please sign out and sign back in");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleSetAdmin} className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            Fix Admin Role (Click Once)
          </Button>
          <Button variant="outline" onClick={handleSeedCategories} className="cursor-pointer">
            <Layers className="mr-2 h-4 w-4" />
            Seed Categories
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-linear-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productStats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              {productStats?.activeProducts || 0} active products
            </p>
            <Link href="/admin/products" className="cursor-pointer">
              <Button variant="link" size="sm" className="px-0 mt-2 h-auto cursor-pointer">
                View all →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-yellow-500" />
              {orderStats?.pendingOrders || 0} pending orders
            </p>
            <Link href="/admin/orders" className="cursor-pointer">
              <Button variant="link" size="sm" className="px-0 mt-2 h-auto cursor-pointer">
                Manage orders →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hire Requests</CardTitle>
            <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hireStats?.totalRequests || 0}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-yellow-500" />
              {hireStats?.pendingRequests || 0} pending quotes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-rose-500/10 to-pink-500/10 border-rose-500/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R{(orderStats?.totalRevenue || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              {orderStats?.completedOrders || 0} completed orders
            </p>
            <Link href="/admin/analytics" className="cursor-pointer">
              <Button variant="link" size="sm" className="px-0 mt-2 h-auto cursor-pointer">
                View analytics →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Jewelry Items</span>
              <Badge variant="secondary">{productStats?.jewelryCount || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Decor Items</span>
              <Badge variant="secondary">{productStats?.decorCount || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Low Stock</span>
              <Badge variant="destructive">{productStats?.lowStock || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Featured</span>
              <Badge variant="outline">{productStats?.featuredCount || 0}</Badge>
            </div>
            <Link href="/admin/stock" className="cursor-pointer">
              <Button variant="outline" size="sm" className="w-full mt-2 cursor-pointer">
                Manage Stock
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Order Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pending</span>
              <Badge className="bg-yellow-500 hover:bg-yellow-600">{orderStats?.pendingOrders || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Processing</span>
              <Badge className="bg-blue-500 hover:bg-blue-600">{orderStats?.processingOrders || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Completed</span>
              <Badge className="bg-green-500 hover:bg-green-600">{orderStats?.completedOrders || 0}</Badge>
            </div>
            <Link href="/admin/orders" className="cursor-pointer">
              <Button variant="outline" size="sm" className="w-full mt-2 cursor-pointer">
                View All Orders
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Hire Request Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pending</span>
              <Badge className="bg-yellow-500 hover:bg-yellow-600">{hireStats?.pendingRequests || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Quoted</span>
              <Badge className="bg-blue-500 hover:bg-blue-600">{hireStats?.quotedRequests || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Confirmed</span>
              <Badge className="bg-green-500 hover:bg-green-600">{hireStats?.confirmedRequests || 0}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Link href="/admin/products" className="cursor-pointer">
              <Button variant="outline" className="w-full justify-start cursor-pointer">
                <Package className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
            <Link href="/admin/orders" className="cursor-pointer">
              <Button variant="outline" className="w-full justify-start cursor-pointer">
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Orders
              </Button>
            </Link>
            <Link href="/admin/stock" className="cursor-pointer">
              <Button variant="outline" className="w-full justify-start cursor-pointer">
                <Layers className="mr-2 h-4 w-4" />
                Check Stock
              </Button>
            </Link>
            <Link href="/admin/analytics" className="cursor-pointer">
              <Button variant="outline" className="w-full justify-start cursor-pointer">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
