import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payload = await request.json();
    const eventType = payload.type;

    console.log("Clerk webhook received:", eventType);

    if (eventType === "user.created" || eventType === "user.updated") {
      const userData = payload.data;
      
      const tokenIdentifier = userData.id;
      const email = userData.email_addresses?.[0]?.email_address || "";
      const firstName = userData.first_name || "";
      const lastName = userData.last_name || "";
      const name = `${firstName} ${lastName}`.trim() || email.split("@")[0] || "User";
      
      // Check for role in public metadata or unsafe metadata
      // Clerk may have role as "ADMIN" (uppercase) - we normalize to lowercase
      const clerkRole = 
        userData.public_metadata?.role || 
        userData.unsafe_metadata?.role || 
        "";
      
      // Normalize role to lowercase for comparison
      const normalizedRole = clerkRole.toString().toLowerCase();
      const role = normalizedRole === "admin" ? "admin" : "customer";

      console.log("Processing user:", { tokenIdentifier, email, name, clerkRole, normalizedRole, role });

      // Call the internal mutation to store/update the user
      await ctx.runMutation(api.users.storeFromWebhook, {
        tokenIdentifier,
        name,
        email,
        role,
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (eventType === "user.deleted") {
      const userData = payload.data;
      const tokenIdentifier = userData.id;

      console.log("User deleted:", tokenIdentifier);

      // Optionally handle user deletion
      // await ctx.runMutation(api.users.deleteByToken, { tokenIdentifier });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return success for unhandled event types
    return new Response(JSON.stringify({ success: true, message: "Event not handled" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
