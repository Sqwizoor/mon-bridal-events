import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const store = mutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (user !== null) {
      // Update existing user info if needed
      if (user.name !== args.name || user.email !== args.email) {
        await ctx.db.patch(user._id, { name: args.name, email: args.email });
      }
      return user._id;
    }

    return await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      email: args.email,
      role: "customer",
    });
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    return user;
  },
});

export const setAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, { role: "admin" });
      return "Updated existing user to admin";
    }

    // If user doesn't exist, create them as admin
    await ctx.db.insert("users", {
      tokenIdentifier: identity.subject,
      name: identity.name || "Admin User",
      email: identity.email || "",
      role: "admin",
    });
    return "Created new admin user";
  },
});

export const getUser = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();
  },
});

// Called from Clerk webhook to store/update user
export const storeFromWebhook = mutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("customer")),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (existingUser) {
      // Update existing user - always update role from webhook
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
        role: args.role,
      });
      console.log("Updated user from webhook:", args.tokenIdentifier, "role:", args.role);
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      email: args.email,
      role: args.role,
      createdAt: Date.now(),
    });
    console.log("Created user from webhook:", args.tokenIdentifier, "role:", args.role);
    return userId;
  },
});

// Sync user from client-side (called by UserSync component)
// This also checks Clerk metadata for role
export const syncFromClient = mutation({
  args: {
    clerkRole: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    // Normalize the Clerk role (could be "ADMIN" or "admin")
    const normalizedClerkRole = args.clerkRole?.toLowerCase();
    const roleFromClerk = normalizedClerkRole === "admin" ? "admin" : "customer";

    if (existingUser) {
      // If Clerk says admin but Convex doesn't, update to admin
      if (roleFromClerk === "admin" && existingUser.role !== "admin") {
        await ctx.db.patch(existingUser._id, { role: "admin" });
        console.log("Upgraded user to admin from client sync:", identity.subject);
      }
      // Update name/email if changed
      if (existingUser.name !== identity.name || existingUser.email !== identity.email) {
        await ctx.db.patch(existingUser._id, {
          name: identity.name || existingUser.name,
          email: identity.email || existingUser.email,
        });
      }
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.subject,
      name: identity.name || "User",
      email: identity.email || "",
      role: roleFromClerk,
      createdAt: Date.now(),
    });
    console.log("Created user from client sync:", identity.subject, "role:", roleFromClerk);
    return userId;
  },
});
