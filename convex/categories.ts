import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

// Get categories by type
export const getByType = query({
  args: { type: v.union(v.literal("jewelry"), v.literal("decor")) },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Add image URLs
    const categoriesWithImages = await Promise.all(
      categories.map(async (category) => {
        let imageUrl = category.externalImageUrl || null;
        if (category.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(category.imageStorageId);
        }
        return { ...category, imageUrl };
      })
    );

    return categoriesWithImages.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

// Get all categories
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();

    const categoriesWithImages = await Promise.all(
      categories.map(async (category) => {
        let imageUrl = category.externalImageUrl || null;
        if (category.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(category.imageStorageId);
        }
        return { ...category, imageUrl };
      })
    );

    return categoriesWithImages.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

// Get category by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!category) return null;

    let imageUrl = category.externalImageUrl || null;
    if (category.imageStorageId) {
      imageUrl = await ctx.storage.getUrl(category.imageStorageId);
    }

    return { ...category, imageUrl };
  },
});

// Admin: Create category
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    externalImageUrl: v.optional(v.string()),
    type: v.union(v.literal("jewelry"), v.literal("decor")),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);

    const slug = generateSlug(args.name);

    // Get max display order
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect();
    const maxOrder = existing.reduce((max, c) => Math.max(max, c.displayOrder), 0);

    return await ctx.db.insert("categories", {
      name: args.name,
      slug,
      description: args.description,
      imageStorageId: args.imageStorageId,
      externalImageUrl: args.externalImageUrl,
      type: args.type,
      displayOrder: args.displayOrder ?? maxOrder + 1,
      isActive: true,
    });
  },
});

// Admin: Update category
export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    externalImageUrl: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);

    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Category not found");
    }

    const updateData: any = { ...updates };
    if (updates.name) {
      updateData.slug = generateSlug(updates.name);
    }

    // Clean undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await ctx.db.patch(id, updateData);
    return id;
  },
});

// Admin: Delete category
export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);
    await ctx.db.delete(args.id);
    return true;
  },
});

// Seed default decor categories (like Something Borrowed)
export const seedDecorCategories = mutation({
  args: {},
  handler: async (ctx) => {
    // await verifyAdmin(ctx); // Temporarily disabled for seeding

    const decorCategories = [
      { name: "Candle Holders", slug: "candle-holders" },
      { name: "Vases", slug: "vases" },
      { name: "Table Linen", slug: "table-linen" },
      { name: "Underplates", slug: "underplates" },
      { name: "Crockery & Serveware", slug: "crockery-serveware" },
      { name: "Cutlery", slug: "cutlery" },
      { name: "Coloured Glassware", slug: "coloured-glassware" },
      { name: "Cake & Cupcake Stands", slug: "cake-cupcake-stands" },
      { name: "Lanterns", slug: "lanterns" },
      { name: "Furniture", slug: "furniture" },
      { name: "Easels", slug: "easels" },
      { name: "Candy Jars", slug: "candy-jars" },
      { name: "Chalkboards", slug: "chalkboards" },
      { name: "Gift & Card Holders", slug: "gift-card-holders" },
      { name: "Lawn Games", slug: "lawn-games" },
      { name: "Pots & Buckets", slug: "pots-buckets" },
      { name: "Table Decor", slug: "table-decor" },
      { name: "Drinks & Beverages", slug: "drinks-beverages" },
      { name: "Miscellaneous", slug: "miscellaneous" },
    ];

    const jewelryCategories = [
      { name: "Rings", slug: "rings" },
      { name: "Necklaces", slug: "necklaces" },
      { name: "Earrings", slug: "earrings" },
      { name: "Bracelets", slug: "bracelets" },
      { name: "Brooches", slug: "brooches" },
      { name: "Jewelry Sets", slug: "jewelry-sets" },
      { name: "Anklets", slug: "anklets" },
      { name: "Hair Accessories", slug: "hair-accessories" },
    ];

    let order = 1;
    for (const cat of decorCategories) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", cat.slug))
        .unique();
      
      if (!existing) {
        await ctx.db.insert("categories", {
          name: cat.name,
          slug: cat.slug,
          type: "decor",
          displayOrder: order,
          isActive: true,
        });
      }
      order++;
    }

    order = 1;
    for (const cat of jewelryCategories) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", cat.slug))
        .unique();
      
      if (!existing) {
        await ctx.db.insert("categories", {
          name: cat.name,
          slug: cat.slug,
          type: "jewelry",
          displayOrder: order,
          isActive: true,
        });
      }
      order++;
    }

    return "Categories seeded successfully";
  },
});

export const seedManualCategories = mutation({
  args: {},
  handler: async (ctx) => {
    // await verifyAdmin(ctx); // Temporarily disabled for seeding

    const categories = [
      { 
        name: "Rings", 
        slug: "rings", 
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop" 
      },
      { 
        name: "Necklaces", 
        slug: "necklaces", 
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=400&auto=format&fit=crop" 
      },
      { 
        name: "Earrings", 
        slug: "earrings", 
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop" 
      },
      { 
        name: "Bracelets", 
        slug: "bracelets", 
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop" 
      },
      { 
        name: "Bridal Sets", 
        slug: "sets", 
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&auto=format&fit=crop" 
      },
      { 
        name: "Hair Accessories", 
        slug: "hair_accessories", 
        image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=400&auto=format&fit=crop" 
      },
      { 
        name: "Anklets", 
        slug: "anklets", 
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=400&auto=format&fit=crop" 
      },
    ];

    let order = 1;
    for (const cat of categories) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", cat.slug))
        .unique();
      
      if (existing) {
        // Update existing if needed (e.g. to add image if missing)
        await ctx.db.patch(existing._id, {
            externalImageUrl: cat.image,
            name: cat.name, // Ensure name matches
            type: "jewelry",
            isActive: true,
        });
      } else {
        await ctx.db.insert("categories", {
          name: cat.name,
          slug: cat.slug,
          type: "jewelry",
          displayOrder: order,
          isActive: true,
          externalImageUrl: cat.image,
        });
      }
      order++;
    }

    return "Manual categories seeded successfully";
  },
});
