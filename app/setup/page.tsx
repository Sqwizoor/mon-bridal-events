"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const setAdmin = useMutation(api.users.setAdmin);
  const router = useRouter();

  const handleMakeAdmin = async () => {
    try {
      await setAdmin();
      toast.success("You are now an Admin!");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role. Ensure you are logged in.");
    }
  };

  return (
    <div className="container py-24 text-center">
      <h1 className="text-3xl font-bold mb-8">Setup Admin Access</h1>
      <p className="mb-8 text-muted-foreground">
        Click the button below to grant yourself Admin privileges in the database.
        <br />
        (This bypasses the Clerk metadata issue).
      </p>
      <Button size="lg" onClick={handleMakeAdmin}>
        Make Me Admin
      </Button>
    </div>
  );
}
