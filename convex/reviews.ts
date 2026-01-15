import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const create = mutation({
  args: {
    productId: v.id("products"),
    rating: v.number(),
    title: v.optional(v.string()),
    content: v.string(),
    images: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      console.log("Review create - identity:", identity ? { subject: identity.subject, email: identity.email } : null);
      
      if (!identity) {
        throw new Error("You must be logged in to leave a review");
      }

      // Try both tokenIdentifier patterns (Clerk uses subject, some setups use tokenIdentifier)
      let user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
        .first();
      
      // If not found with subject, try with the full tokenIdentifier if available
      if (!user && identity.tokenIdentifier) {
        user = await ctx.db
          .query("users")
          .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
          .first();
      }

      console.log("Review create - user found:", user ? { id: user._id, name: user.name } : null);

      if (!user) {
        // Auto-create user if not exists
        console.log("Review create - creating new user");
        const userId = await ctx.db.insert("users", {
          tokenIdentifier: identity.subject,
          name: identity.name || "User",
          email: identity.email || "",
          role: "customer",
          createdAt: Date.now(),
        });
        user = await ctx.db.get(userId);
      }

      if (!user) {
        throw new Error("Failed to create or find user");
      }

      // Check if product exists
      const product = await ctx.db.get(args.productId);
      if (!product) {
        throw new Error("Product not found");
      }

      // Check if user has already reviewed this product
      const existingReview = await ctx.db
        .query("reviews")
        .withIndex("by_product", (q) => q.eq("productId", args.productId))
        .filter((q) => q.eq(q.field("userId"), user!._id))
        .first();

      if (existingReview) {
        throw new Error("You have already reviewed this product");
      }

      // Calculate new average rating for the product
      const productReviews = await ctx.db
        .query("reviews")
        .withIndex("by_product", (q) => q.eq("productId", args.productId))
        .collect();
      
      const currentRatingCount = productReviews.length;
      const currentTotalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
      
      const newRatingCount = currentRatingCount + 1;
      const newTotalRating = currentTotalRating + args.rating;
      const newAverageRating = newTotalRating / newRatingCount;

      // Create the review
      await ctx.db.insert("reviews", {
          userId: user._id,
          productId: args.productId,
          rating: args.rating,
          title: args.title,
          content: args.content,
          images: args.images,
          isVerifiedPurchase: false,
          isApproved: true,
          createdAt: Date.now(),
      });

      // Update the product with new rating stats (with error handling)
      try {
        await ctx.db.patch(args.productId, {
            rating: newAverageRating,
            reviewCount: newRatingCount,
        });
      } catch (patchError) {
        // Product rating update failed but review was created - that's okay
        console.error("Failed to update product rating:", patchError);
      }

      return { success: true };
    } catch (error: any) {
      console.error("Error creating review:", error);
      throw new Error(error.message || "Failed to create review");
    }
  },
});

export const getByProduct = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    try {
      const reviews = await ctx.db
        .query("reviews")
        .withIndex("by_product", (q) => q.eq("productId", args.productId))
        .order("desc") // Most recent first
        .take(10); // Limit to recent 10 for now or implement pagination

      // Fetch user details for each review to show author name
      const reviewsWithAuthors = await Promise.all(
          reviews.map(async (review) => {
              try {
                  const author = await ctx.db.get(review.userId);
                  let avatarUrl = null;
                  
                  // Safely get avatar URL if author exists and has avatar
                  if (author?.avatarStorageId) {
                      try {
                          avatarUrl = await ctx.storage.getUrl(author.avatarStorageId);
                      } catch {
                          avatarUrl = null;
                      }
                  }
                  
                  return {
                      ...review,
                      authorName: author?.name || "Anonymous",
                      authorAvatar: avatarUrl
                  };
              } catch {
                  return {
                      ...review,
                      authorName: "Anonymous",
                      authorAvatar: null
                  };
              }
          })
      );

      return reviewsWithAuthors;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },
});
