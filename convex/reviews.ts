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
    // Validate rating
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    
    // Validate content
    if (!args.content || args.content.trim().length === 0) {
      throw new Error("Review content is required");
    }

    const identity = await ctx.auth.getUserIdentity();
    console.log("Review create - Full identity object:", JSON.stringify(identity, null, 2));
    
    if (!identity) {
      throw new Error("You must be logged in to leave a review");
    }

    // Try to find user with subject first (Clerk's standard identifier)
    let user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();
    
    console.log("Review create - Lookup with subject:", identity.subject, "-> Found:", !!user);
    
    // If not found with subject, try with tokenIdentifier (alternative format)
    if (!user && identity.tokenIdentifier && identity.tokenIdentifier !== identity.subject) {
      user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .first();
      console.log("Review create - Lookup with tokenIdentifier:", identity.tokenIdentifier, "-> Found:", !!user);
    }

    // Auto-create user if not exists (happens on first review)
    if (!user) {
      console.log("Review create - User not found, creating new user");
      try {
        const userId = await ctx.db.insert("users", {
          tokenIdentifier: identity.subject,
          name: identity.name || identity.email?.split("@")[0] || "User",
          email: identity.email || "",
          role: "customer",
          createdAt: Date.now(),
        });
        user = await ctx.db.get(userId);
        console.log("Review create - Created new user:", userId);
      } catch (insertError) {
        console.error("Review create - Failed to create user:", insertError);
        throw new Error("Failed to create user account. Please try refreshing the page.");
      }
    }

    if (!user) {
      throw new Error("Unable to verify your account. Please try signing out and back in.");
    }
    
    console.log("Review create - Using user:", { id: user._id, name: user.name });

    // Check if product exists
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }
    
    console.log("Review create - Product found:", product.name);

    // Check if user has already reviewed this product
    const existingReview = await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .filter((q) => q.eq(q.field("userId"), user!._id))
      .first();

    if (existingReview) {
      throw new Error("You have already reviewed this product");
    }
    
    console.log("Review create - No existing review, proceeding to create");

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
    const reviewId = await ctx.db.insert("reviews", {
        userId: user._id,
        productId: args.productId,
        rating: args.rating,
        title: args.title || undefined,
        content: args.content.trim(),
        images: args.images,
        isVerifiedPurchase: false,
        isApproved: true,
        createdAt: Date.now(),
    });
    
    console.log("Review create - Review created:", reviewId);

    // Update the product with new rating stats
    try {
      await ctx.db.patch(args.productId, {
          rating: newAverageRating,
          reviewCount: newRatingCount,
      });
      console.log("Review create - Product rating updated");
    } catch (patchError) {
      // Product rating update failed but review was created - that's okay
      console.error("Failed to update product rating:", patchError);
    }

    return { success: true, reviewId };
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
