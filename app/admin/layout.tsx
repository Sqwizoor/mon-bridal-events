"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

import { Skeleton } from "@/components/ui/skeleton";

// ... existing imports

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const convexUser = useQuery(api.users.current);
  const { user: clerkUser, isLoaded } = useUser();
  const router = useRouter();

  const clerkRole = (clerkUser?.publicMetadata?.role as string) || (clerkUser?.unsafeMetadata?.role as string);
  const isAdmin = 
    convexUser?.role === "admin" || 
    clerkRole?.toLowerCase() === "admin";

  useEffect(() => {
    if (isLoaded && convexUser !== undefined) {
      if (!isAdmin) {
        toast.error("You are not authorized to view this page.");
        router.push("/");
      }
    }
  }, [isAdmin, isLoaded, convexUser, router]);

  if (!isLoaded || convexUser === undefined) {
    return (
      <div className="flex min-h-screen bg-background">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-64 border-r bg-background p-4 space-y-4">
          <div className="flex items-center space-x-2 mb-8 px-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b flex items-center px-8">
             <Skeleton className="h-8 w-64" />
          </div>
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
               <Skeleton className="h-10 w-48" />
               <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <SignedIn>
        <div className="flex min-h-screen bg-background">
          <AdminSidebar />
          <div className="flex-1 lg:ml-64 flex flex-col">
            <AdminNavbar />
            <main className="flex-1">
              <div className="container py-8 px-4 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
