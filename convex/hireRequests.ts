import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Helper to verify admin role
async function verifyAdmin(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", identity.subject))
    .unique();
  if (!user || user.role !== "admin") {
    throw new Error("Not authorized - admin access required");
  }
  return user;
}

// Get user's hire requests
export const getUserRequests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) return [];

    return await ctx.db
      .query("hireRequests")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Get all hire requests (admin)
export const getAll = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let requestsQuery = ctx.db.query("hireRequests");

    if (args.status) {
      requestsQuery = requestsQuery.filter((q) =>
        q.eq(q.field("status"), args.status)
      );
    }

    const requests = await requestsQuery.collect();
    return requests.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get hire request by ID
export const getById = query({
  args: { id: v.id("hireRequests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create hire request (quote request)
export const create = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        quantity: v.number(),
        hirePrice: v.number(),
      })
    ),
    eventDate: v.string(),
    eventEndDate: v.optional(v.string()),
    eventType: v.optional(v.string()),
    venue: v.optional(v.string()),
    message: v.optional(v.string()),
    guestName: v.optional(v.string()),
    guestEmail: v.optional(v.string()),
    guestPhone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let userId = undefined;

    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
        .unique();
      if (user) {
        userId = user._id;
      }
    }

    // Calculate estimated total
    const estimatedTotal = args.items.reduce(
      (sum, item) => sum + item.hirePrice * item.quantity,
      0
    );

    const now = Date.now();

    return await ctx.db.insert("hireRequests", {
      userId,
      guestName: args.guestName,
      guestEmail: args.guestEmail,
      guestPhone: args.guestPhone,
      items: args.items,
      eventDate: args.eventDate,
      eventEndDate: args.eventEndDate,
      eventType: args.eventType,
      venue: args.venue,
      message: args.message,
      estimatedTotal,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update hire request status (admin)
export const updateStatus = mutation({
  args: {
    id: v.id("hireRequests"),
    status: v.union(
      v.literal("pending"),
      v.literal("quoted"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    quotedAmount: v.optional(v.number()),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);

    const updates: any = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.quotedAmount !== undefined) {
      updates.quotedAmount = args.quotedAmount;
    }

    if (args.adminNotes !== undefined) {
      updates.adminNotes = args.adminNotes;
    }

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

// Mark deposit as paid (admin)
export const markDepositPaid = mutation({
  args: { id: v.id("hireRequests") },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);

    await ctx.db.patch(args.id, {
      depositPaid: true,
      status: "confirmed",
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

// Get hire request stats for admin dashboard
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const requests = await ctx.db.query("hireRequests").collect();

    const totalRequests = requests.length;
    const pendingRequests = requests.filter((r) => r.status === "pending").length;
    const quotedRequests = requests.filter((r) => r.status === "quoted").length;
    const confirmedRequests = requests.filter((r) => r.status === "confirmed").length;
    const completedRequests = requests.filter((r) => r.status === "completed").length;

    // Upcoming events (confirmed and not completed)
    const upcomingEvents = requests
      .filter((r) => r.status === "confirmed" && new Date(r.eventDate) >= new Date())
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      .slice(0, 5);

    return {
      totalRequests,
      pendingRequests,
      quotedRequests,
      confirmedRequests,
      completedRequests,
      upcomingEvents,
    };
  },
});
