import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all wishlist items for the current user
export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (!user) {
      return [];
    }

    const wishlistItems = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Fetch product details for each wishlist item
    const itemsWithProducts = await Promise.all(
      wishlistItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        if (!product) return null;

        let imageUrl = null;
        if (product.imageStorageId) {
          try {
            imageUrl = await ctx.storage.getUrl(product.imageStorageId);
          } catch {
            imageUrl = null;
          }
        }

        return {
          ...item,
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            imageUrl,
            category: product.category,
            isForHire: product.isForHire,
            hirePrice: product.hirePrice,
          },
        };
      })
    );

    return itemsWithProducts.filter(Boolean);
  },
});

// Add item to wishlist
export const add = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to add items to your wishlist");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if already in wishlist
    const existing = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    if (existing) {
      return { success: true, message: "Item already in wishlist" };
    }

    await ctx.db.insert("wishlist", {
      userId: user._id,
      productId: args.productId,
      addedAt: Date.now(),
    });

    return { success: true };
  },
});

// Remove item from wishlist
export const remove = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const item = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    if (item) {
      await ctx.db.delete(item._id);
    }

    return { success: true };
  },
});

// Toggle wishlist item (add if not exists, remove if exists)
export const toggle = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to manage your wishlist");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const existing = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { added: false };
    } else {
      await ctx.db.insert("wishlist", {
        userId: user._id,
        productId: args.productId,
        addedAt: Date.now(),
      });
      return { added: true };
    }
  },
});

// Check if a product is in the user's wishlist
export const isInWishlist = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (!user) {
      return false;
    }

    const item = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    return !!item;
  },
});

// Get wishlist count for current user
export const count = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (!user) {
      return 0;
    }

    const items = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return items.length;
  },
});
