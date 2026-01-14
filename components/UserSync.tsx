"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export default function UserSync() {
  const { user, isLoaded } = useUser();
  const syncFromClient = useMutation(api.users.syncFromClient);

  useEffect(() => {
    if (isLoaded && user) {
      // Get role from Clerk metadata (could be "ADMIN" or "admin")
      const clerkRole = 
        (user.publicMetadata?.role as string) || 
        (user.unsafeMetadata?.role as string) || 
        undefined;

      console.log("UserSync: Syncing user with role:", clerkRole);

      // Sync user to Convex with Clerk role
      syncFromClient({ clerkRole });
    }
  }, [user, isLoaded, syncFromClient]);

  return null;
}
