import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Categories for organizing products (like Something Borrowed's decor categories)
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    externalImageUrl: v.optional(v.string()), // For seeded/external images
    parentCategory: v.optional(v.id("categories")),
    type: v.union(v.literal("jewelry"), v.literal("decor")),
    displayOrder: v.number(),
    isActive: v.boolean(),
  })
    .index("by_type", ["type"])
    .index("by_slug", ["slug"])
    .index("by_parent", ["parentCategory"]),

  // Comprehensive product schema
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    
    // Pricing
    price: v.number(),
    compareAtPrice: v.optional(v.number()), // Original price for sale items
    costPrice: v.optional(v.number()), // Cost for profit tracking
    
    // Categorization
    category: v.union(v.literal("jewelry"), v.literal("decor")),
    subcategoryId: v.optional(v.id("categories")),
    tags: v.optional(v.array(v.string())),
    
    // For jewelry
    jewelryType: v.optional(v.union(
      v.literal("rings"),
      v.literal("necklaces"),
      v.literal("earrings"),
      v.literal("bracelets"),
      v.literal("brooches"),
      v.literal("sets"),
      v.literal("anklets"),
      v.literal("hair_accessories"),
      v.literal("other")
    )),
    
    // For decor hire (inspired by Something Borrowed)
    decorType: v.optional(v.union(
      v.literal("candle_holders"),
      v.literal("vases"),
      v.literal("table_linen"),
      v.literal("underplates"),
      v.literal("crockery"),
      v.literal("cutlery"),
      v.literal("glassware"),
      v.literal("cake_stands"),
      v.literal("lanterns"),
      v.literal("furniture"),
      v.literal("easels"),
      v.literal("candy_jars"),
      v.literal("chalkboards"),
      v.literal("gift_holders"),
      v.literal("lawn_games"),
      v.literal("pots_buckets"),
      v.literal("table_decor"),
      v.literal("miscellaneous")
    )),
    
    // Product attributes
    colors: v.optional(v.array(v.object({
      name: v.string(),
      hexCode: v.optional(v.string()),
      imageStorageId: v.optional(v.id("_storage")),
    }))),
    
    sizes: v.optional(v.array(v.object({
      name: v.string(),
      dimensions: v.optional(v.string()),
      priceModifier: v.optional(v.number()),
    }))),
    
    materials: v.optional(v.array(v.string())),
    
    // Images (multiple images support)
    images: v.optional(v.array(v.object({
      storageId: v.id("_storage"),
      alt: v.optional(v.string()),
      isPrimary: v.boolean(),
      displayOrder: v.number(),
    }))),
    
    // Legacy single image support
    imageStorageId: v.optional(v.id("_storage")),
    
    // Inventory
    stockQuantity: v.number(),
    lowStockThreshold: v.optional(v.number()),
    sku: v.optional(v.string()),
    
    // For hire items
    isForHire: v.boolean(),
    hirePrice: v.optional(v.number()), // Price per day
    minimumHireDays: v.optional(v.number()),
    depositAmount: v.optional(v.number()),
    availableQuantity: v.optional(v.number()), // For hire items
    
    // Status
    isActive: v.boolean(),
    isFeatured: v.optional(v.boolean()),
    isNew: v.optional(v.boolean()),
    isOnSale: v.optional(v.boolean()),
    saleEndDate: v.optional(v.number()),
    
    // SEO & metadata
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_subcategory", ["subcategoryId"])
    .index("by_jewelry_type", ["jewelryType"])
    .index("by_decor_type", ["decorType"])
    .index("by_slug", ["slug"])
    .index("by_featured", ["isFeatured"])
    .index("by_active", ["isActive"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["category", "isActive"],
    }),

  // Users with enhanced fields
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("customer")),
    avatarStorageId: v.optional(v.id("_storage")),
    addresses: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      street: v.string(),
      city: v.string(),
      province: v.string(),
      postalCode: v.string(),
      country: v.string(),
      isDefault: v.boolean(),
    }))),
    createdAt: v.optional(v.number()),
  }).index("by_token", ["tokenIdentifier"]),

  // Orders with comprehensive tracking
  orders: defineTable({
    userId: v.optional(v.id("users")), // Made optional for guest checkout
    guestName: v.optional(v.string()),
    guestEmail: v.optional(v.string()),
    guestPhone: v.optional(v.string()),
    orderNumber: v.string(),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
      color: v.optional(v.string()),
      size: v.optional(v.string()),
      imageStorageId: v.optional(v.id("_storage")),
      isForHire: v.optional(v.boolean()),
    })),
    rentalStartDate: v.optional(v.number()),
    rentalEndDate: v.optional(v.number()),
    subtotal: v.number(),
    tax: v.optional(v.number()),
    shippingCost: v.optional(v.number()),
    discount: v.optional(v.number()),
    total: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    paymentMethod: v.optional(v.string()),
    paymentId: v.optional(v.string()),
    shippingAddress: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      province: v.string(),
      postalCode: v.string(),
      country: v.string(),
    })),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_order_number", ["orderNumber"]),

  // Hire/Quote requests for decor items
  hireRequests: defineTable({
    userId: v.optional(v.id("users")),
    guestEmail: v.optional(v.string()),
    guestName: v.optional(v.string()),
    guestPhone: v.optional(v.string()),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      quantity: v.number(),
      hirePrice: v.number(),
    })),
    eventDate: v.string(),
    eventEndDate: v.optional(v.string()),
    eventType: v.optional(v.string()),
    venue: v.optional(v.string()),
    message: v.optional(v.string()),
    estimatedTotal: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("quoted"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    adminNotes: v.optional(v.string()),
    quotedAmount: v.optional(v.number()),
    depositPaid: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_event_date", ["eventDate"]),

  // General inquiries and bookings
  inquiries: defineTable({
    userId: v.optional(v.id("users")),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.optional(v.string()), // Made optional for booking forms
    eventType: v.optional(v.string()), // Added for bookings
    eventDate: v.optional(v.string()), // Added for bookings
    venue: v.optional(v.string()), // Added for bookings
    guestCount: v.optional(v.number()), // Added for bookings
    message: v.string(),
    productId: v.optional(v.id("products")),
    status: v.union(
      v.literal("new"),
      v.literal("read"),
      v.literal("replied"),
      v.literal("closed")
    ),
    adminReply: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_user", ["userId"]),

  // Wishlist
  wishlist: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_product", ["productId"]),

  // Reviews
  reviews: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    orderId: v.optional(v.id("orders")),
    rating: v.number(),
    title: v.optional(v.string()),
    content: v.string(),
    images: v.optional(v.array(v.id("_storage"))),
    isVerifiedPurchase: v.boolean(),
    isApproved: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_user", ["userId"]),

  // Site settings
  settings: defineTable({
    key: v.string(),
    value: v.string(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
});
