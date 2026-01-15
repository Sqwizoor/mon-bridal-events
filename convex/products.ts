import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper to verify admin role - checks Clerk metadata
async function verifyAdmin(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  console.log("🔐 verifyAdmin - identity:", identity?.subject);
  
  // TEMPORARY DEV BYPASS - Remove this after setting up Clerk JWT template
  if (!identity) {
    console.warn("⚠️ DEV MODE: No identity found, bypassing auth check");
    console.warn("⚠️ IMPORTANT: Set up Clerk JWT template for production!");
    console.warn("⚠️ See CLERK_CONVEX_SETUP.md for instructions");
    return { email: "dev-user", role: "admin" };
  }
  
  // Check Clerk public metadata for admin role
  const clerkRole = identity.publicMetadata?.role || identity.unsafeMetadata?.role;
  console.log("👤 Clerk role from JWT:", clerkRole);
  
  // Check if user is admin in Clerk
  if (clerkRole && clerkRole.toString().toLowerCase() === "admin") {
    console.log("✅ Admin verified via Clerk metadata:", identity.email);
    return identity;
  }
  
  // Fallback: Check Convex database
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", identity.subject))
    .unique();
  
  if (user && user.role === "admin") {
    console.log("✅ Admin verified via Convex database:", user.email);
    return user;
  }
  
  console.error("❌ Not authorized. Clerk role:", clerkRole, "Convex role:", user?.role);
  throw new Error("Not authorized - admin access required. Please ensure you have admin role in Clerk.");
}

// Get all products with optional filters
export const get = query({
  args: {
    category: v.optional(v.string()),
    decorType: v.optional(v.string()),
    jewelryType: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let productsQuery = ctx.db.query("products");

    if (args.category) {
      productsQuery = productsQuery.filter((q) =>
        q.eq(q.field("category"), args.category)
      );
    }

    if (args.decorType) {
      productsQuery = productsQuery.filter((q) =>
        q.eq(q.field("decorType"), args.decorType)
      );
    }

    if (args.jewelryType) {
      productsQuery = productsQuery.filter((q) =>
        q.eq(q.field("jewelryType"), args.jewelryType)
      );
    }

    if (args.isActive !== undefined) {
      productsQuery = productsQuery.filter((q) =>
        q.eq(q.field("isActive"), args.isActive)
      );
    }

    if (args.isFeatured !== undefined) {
      productsQuery = productsQuery.filter((q) =>
        q.eq(q.field("isFeatured"), args.isFeatured)
      );
    }

    const products = await productsQuery.collect();

    // Add image URLs to products
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        let imageUrl = null;
        if (product.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(product.imageStorageId);
        } else if (product.images && product.images.length > 0) {
          const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
          imageUrl = await ctx.storage.getUrl(primaryImage.storageId);
        }
        return { ...product, imageUrl };
      })
    );

    if (args.limit) {
      return productsWithImages.slice(0, args.limit);
    }

    return productsWithImages;
  },
});

// Get products with pagination
export const getPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: v.optional(v.string()),
    decorType: v.optional(v.string()),
    jewelryType: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let productsQuery = ctx.db.query("products");

    if (args.category) {
      productsQuery = productsQuery.filter((q) =>
        q.eq(q.field("category"), args.category)
      );
    }

    if (args.decorType) {
      productsQuery = productsQuery.filter((q) =>
        q.eq(q.field("decorType"), args.decorType)
      );
    }

    if (args.jewelryType) {
      productsQuery = productsQuery.filter((q) =>
        q.eq(q.field("jewelryType"), args.jewelryType)
      );
    }

    if (args.isActive !== undefined) {
      productsQuery = productsQuery.filter((q) =>
        q.eq(q.field("isActive"), args.isActive)
      );
    }

    if (args.isFeatured !== undefined) {
      productsQuery = productsQuery.filter((q) =>
        q.eq(q.field("isFeatured"), args.isFeatured)
      );
    }

    const { page, isDone, continueCursor } = await productsQuery.paginate(args.paginationOpts);

    const productsWithImages = await Promise.all(
      page.map(async (product) => {
        let imageUrl = null;
        if (product.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(product.imageStorageId);
        } else if (product.images && product.images.length > 0) {
          const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
          imageUrl = await ctx.storage.getUrl(primaryImage.storageId);
        }
        return { ...product, imageUrl };
      })
    );

    return { page: productsWithImages, isDone, continueCursor };
  },
});

// Get featured products with pagination
export const getFeaturedPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .filter((q) =>
        q.and(
          q.eq(q.field("isFeatured"), true),
          q.eq(q.field("isActive"), true)
        )
      )
      .paginate(args.paginationOpts);

    const productsWithImages = await Promise.all(
      products.page.map(async (product) => {
        let imageUrl = null;
        if (product.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(product.imageStorageId);
        } else if (product.images && product.images.length > 0) {
          const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
          imageUrl = await ctx.storage.getUrl(primaryImage.storageId);
        }
        return { ...product, imageUrl };
      })
    );

    return { ...products, page: productsWithImages };
  },
});

// Get single product by ID
export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) return null;

    let imageUrl = null;
    let allImageUrls: string[] = [];

    if (product.imageStorageId) {
      imageUrl = await ctx.storage.getUrl(product.imageStorageId);
    }

    if (product.images && product.images.length > 0) {
      allImageUrls = await Promise.all(
        product.images.map(async (img) => {
          const url = await ctx.storage.getUrl(img.storageId);
          return url || "";
        })
      );
      if (!imageUrl) {
        const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
        imageUrl = await ctx.storage.getUrl(primaryImage.storageId);
      }
    }

    return { ...product, imageUrl, allImageUrls };
  },
});

// Get product by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    
    if (!product) return null;

    let imageUrl = null;
    if (product.imageStorageId) {
      imageUrl = await ctx.storage.getUrl(product.imageStorageId);
    }

    return { ...product, imageUrl };
  },
});

// Search products
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const trimmedQuery = args.query.trim();
    if (trimmedQuery.length === 0) return [];

    const products = await ctx.db
      .query("products")
      .withSearchIndex("search_name", (q) =>
        q.search("name", trimmedQuery).eq("isActive", true)
      )
      .take(20);

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        let imageUrl = null;
        if (product.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(product.imageStorageId);
        } else if (product.images && product.images.length > 0) {
          const primaryImage =
            product.images.find((img) => img.isPrimary) ?? product.images[0];
          imageUrl = await ctx.storage.getUrl(primaryImage.storageId);
        }
        return { ...product, imageUrl };
      })
    );

    return productsWithImages;
  },
});

// Get featured products
export const getFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .filter((q) =>
        q.and(
          q.eq(q.field("isFeatured"), true),
          q.eq(q.field("isActive"), true)
        )
      )
      .take(args.limit || 8);

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        let imageUrl = null;
        if (product.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(product.imageStorageId);
        }
        return { ...product, imageUrl };
      })
    );

    return productsWithImages;
  },
});

// Get products by decor type
export const getByDecorType = query({
  args: { decorType: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .filter((q) =>
        q.and(
          q.eq(q.field("decorType"), args.decorType),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        let imageUrl = null;
        if (product.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(product.imageStorageId);
        }
        return { ...product, imageUrl };
      })
    );

    return productsWithImages;
  },
});

// Get products by jewelry type
export const getByJewelryType = query({
  args: { jewelryType: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .filter((q) =>
        q.and(
          q.eq(q.field("jewelryType"), args.jewelryType),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        let imageUrl = null;
        if (product.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(product.imageStorageId);
        }
        return { ...product, imageUrl };
      })
    );

    return productsWithImages;
  },
});

// Admin: Create product
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    category: v.union(v.literal("jewelry"), v.literal("decor")),
    jewelryType: v.optional(v.string()),
    decorType: v.optional(v.string()),
    colors: v.optional(v.array(v.object({
      name: v.string(),
      hexCode: v.optional(v.string()),
    }))),
    sizes: v.optional(v.array(v.object({
      name: v.string(),
      dimensions: v.optional(v.string()),
      priceModifier: v.optional(v.number()),
    }))),
    materials: v.optional(v.array(v.string())),
    imageStorageId: v.optional(v.id("_storage")),
    images: v.optional(v.array(v.object({
      storageId: v.id("_storage"),
      alt: v.optional(v.string()),
      isPrimary: v.boolean(),
      displayOrder: v.number(),
    }))),
    stockQuantity: v.optional(v.number()),
    sku: v.optional(v.string()),
    isForHire: v.optional(v.boolean()),
    hirePrice: v.optional(v.number()),
    depositAmount: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    isNew: v.optional(v.boolean()),
    isOnSale: v.optional(v.boolean()),
    saleEndDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);

    const now = Date.now();
    const slug = generateSlug(args.name);

    return await ctx.db.insert("products", {
      name: args.name,
      slug,
      description: args.description,
      price: args.price,
      compareAtPrice: args.compareAtPrice,
      category: args.category,
      jewelryType: args.jewelryType as any,
      decorType: args.decorType as any,
      colors: args.colors as any,
      sizes: args.sizes,
      materials: args.materials,
      imageStorageId: args.imageStorageId,
      images: args.images,
      stockQuantity: args.stockQuantity ?? 1,
      sku: args.sku,
      isForHire: args.isForHire ?? args.category === "decor",
      hirePrice: args.hirePrice,
      depositAmount: args.depositAmount,
      isActive: args.isActive ?? true,
      isFeatured: args.isFeatured ?? false,
      isNew: args.isNew ?? true,
      isOnSale: args.isOnSale ?? false,
      saleEndDate: args.saleEndDate,
      tags: args.tags,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Admin: Update product
export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    category: v.optional(v.union(v.literal("jewelry"), v.literal("decor"))),
    jewelryType: v.optional(v.string()),
    decorType: v.optional(v.string()),
    colors: v.optional(v.array(v.object({
      name: v.string(),
      hexCode: v.optional(v.string()),
    }))),
    sizes: v.optional(v.array(v.object({
      name: v.string(),
      dimensions: v.optional(v.string()),
      priceModifier: v.optional(v.number()),
    }))),
    materials: v.optional(v.array(v.string())),
    imageStorageId: v.optional(v.id("_storage")),
    images: v.optional(v.array(v.object({
      storageId: v.id("_storage"),
      alt: v.optional(v.string()),
      isPrimary: v.boolean(),
      displayOrder: v.number(),
    }))),
    stockQuantity: v.optional(v.number()),
    sku: v.optional(v.string()),
    isForHire: v.optional(v.boolean()),
    hirePrice: v.optional(v.number()),
    depositAmount: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    isNew: v.optional(v.boolean()),
    isOnSale: v.optional(v.boolean()),
    saleEndDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);

    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Product not found");
    }

    const updateData: any = { ...updates, updatedAt: Date.now() };
    
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

// Admin: Delete product
export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);
    await ctx.db.delete(args.id);
    return true;
  },
});

// Admin: Get all products (including inactive)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        let imageUrl = null;
        if (product.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(product.imageStorageId);
        }

        const imagesWithUrls = product.images
          ? await Promise.all(
              product.images.map(async (img) => ({
                ...img,
                url: await ctx.storage.getUrl(img.storageId),
              }))
            )
          : undefined;

        if (!imageUrl && imagesWithUrls && imagesWithUrls.length > 0) {
          const primaryImage = imagesWithUrls.find((img) => img.isPrimary) || imagesWithUrls[0];
          imageUrl = primaryImage.url;
        }

        return { ...product, imageUrl, images: imagesWithUrls };
      })
    );

    return productsWithImages;
  },
});

// Generate upload URL for images
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Get image URL from storage ID
export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// List all products with stock information (for admin stock page)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        let imageUrl = null;
        if (product.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(product.imageStorageId);
        }

        const imagesWithUrls = product.images
          ? await Promise.all(
              product.images.map(async (img) => ({
                ...img,
                url: await ctx.storage.getUrl(img.storageId),
              }))
            )
          : undefined;

        if (!imageUrl && imagesWithUrls && imagesWithUrls.length > 0) {
          const primaryImage = imagesWithUrls.find((img) => img.isPrimary) || imagesWithUrls[0];
          imageUrl = primaryImage.url;
        }

        return { 
          ...product, 
          imageUrl,
          images: imagesWithUrls,
          stock: product.stockQuantity || 0
        };
      })
    );

    return productsWithImages;
  },
});

// Get product stats for admin dashboard
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allProducts = await ctx.db.query("products").collect();
    
    const totalProducts = allProducts.length;
    const activeProducts = allProducts.filter((p) => p.isActive).length;
    const jewelryCount = allProducts.filter((p) => p.category === "jewelry").length;
    const decorCount = allProducts.filter((p) => p.category === "decor").length;
    const lowStock = allProducts.filter(
      (p) => p.stockQuantity <= (p.lowStockThreshold || 5)
    ).length;
    const featuredCount = allProducts.filter((p) => p.isFeatured).length;

    return {
      totalProducts,
      activeProducts,
      jewelryCount,
      decorCount,
      lowStock,
      featuredCount,
    };
  },
});
