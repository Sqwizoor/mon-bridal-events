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

// Generate order number
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MON-${year}${month}${day}-${random}`;
}

// Get user's orders
export const getUserOrders = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) return [];

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return orders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get all orders (admin)
export const getAll = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let ordersQuery = ctx.db.query("orders");

    if (args.status) {
      ordersQuery = ordersQuery.filter((q) =>
        q.eq(q.field("status"), args.status)
      );
    }

    const orders = await ordersQuery.collect();
    const sortedOrders = orders.sort((a, b) => b.createdAt - a.createdAt);

    if (args.limit) {
      return sortedOrders.slice(0, args.limit);
    }

    return sortedOrders;
  },
});

// Get order by ID
export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create order
export const create = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        color: v.optional(v.string()),
        size: v.optional(v.string()),
        imageStorageId: v.optional(v.id("_storage")),
        isForHire: v.optional(v.boolean()),
      })
    ),
    shippingAddress: v.optional(
      v.object({
        street: v.string(),
        city: v.string(),
        province: v.string(),
        postalCode: v.string(),
        country: v.string(),
      })
    ),
    guestName: v.optional(v.string()),
    guestEmail: v.optional(v.string()),
    guestPhone: v.optional(v.string()),
    notes: v.optional(v.string()),
    rentalStartDate: v.optional(v.number()),
    rentalEndDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let userId: any = undefined;

    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
        .unique();
      if (user) {
        userId = user._id;
      }
    }

    // Calculate Rental Days
    let rentalDays = 1;
    if (args.rentalStartDate && args.rentalEndDate) {
       const diffTime = Math.abs(args.rentalEndDate - args.rentalStartDate);
       rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    }

    // Prepare order data
    const subtotal = args.items.reduce(
      (sum, item) => {
        const itemTotal = item.price * item.quantity;
        // If it's a hiring item, multiply by days
        if (item.isForHire) {
          return sum + (itemTotal * rentalDays);
        }
        return sum + itemTotal;
      },
      0
    );
    const tax = subtotal * 0.15; // 15% VAT
    const shippingCost = subtotal > 1000 ? 0 : 150; // Free shipping over R1000
    const total = subtotal + tax + shippingCost;

    const now = Date.now();

    return await ctx.db.insert("orders", {
      userId,
      guestName: args.guestName,
      guestEmail: args.guestEmail,
      guestPhone: args.guestPhone,
      orderNumber: generateOrderNumber(),
      items: args.items,
      subtotal,
      tax,
      shippingCost,
      total,
      status: "pending",
      paymentStatus: "pending",
      shippingAddress: args.shippingAddress,
      notes: args.notes,
      rentalStartDate: args.rentalStartDate,
      rentalEndDate: args.rentalEndDate,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update order status (admin)
export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

// Update payment status (admin)
export const updatePaymentStatus = mutation({
  args: {
    id: v.id("orders"),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    paymentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);

    const updates: any = {
      paymentStatus: args.paymentStatus,
      updatedAt: Date.now(),
    };

    if (args.paymentId) {
      updates.paymentId = args.paymentId;
    }

    // Auto-confirm order when paid
    if (args.paymentStatus === "paid") {
      const order = await ctx.db.get(args.id);
      if (order?.status === "pending") {
        updates.status = "confirmed";
      }
    }

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

// Get order stats for admin dashboard
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const processingOrders = orders.filter((o) => o.status === "processing").length;
    const completedOrders = orders.filter((o) => o.status === "delivered").length;
    
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.total, 0);

    const recentOrders = orders
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      totalRevenue,
      recentOrders,
    };
  },
});
