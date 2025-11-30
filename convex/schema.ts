import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        tokenIdentifier: v.string(), // Clerk ID
        name: v.string(),
        email: v.optional(v.string()),
        avatar: v.optional(v.string()),
        phone: v.optional(v.string()),
        isVerified: v.boolean(),
        location: v.optional(v.string()),
        about: v.optional(v.string()),
        lastSeen: v.optional(v.number()),
        rating: v.optional(v.number()),
        reviewCount: v.optional(v.number()),
    }).index("by_token", ["tokenIdentifier"]),

    listings: defineTable({
        sellerId: v.string(), // Reference to users.tokenIdentifier or internal ID? Better to use Clerk ID for now or Convex ID. Let's use Clerk ID for sellerId to match easily.
        title: v.string(),
        description: v.string(),
        price: v.number(),
        images: v.array(v.string()),
        category: v.string(),
        subCategory: v.optional(v.string()),
        condition: v.string(), // "new", "like-new", "used", "damaged"
        location: v.object({
            lat: v.number(),
            lng: v.number(),
            name: v.string(),
        }),
        status: v.string(), // "active", "sold", "reserved", "expired"
        views: v.number(),
        favorites: v.number(),
        createdAt: v.number(),
    })
        .index("by_category", ["category"])
        .index("by_seller", ["sellerId"]),

    messages: defineTable({
        threadId: v.id("threads"),
        senderId: v.string(),
        content: v.string(),
        type: v.string(), // "text", "image", "offer"
        offerAmount: v.optional(v.number()),
        offerStatus: v.optional(v.string()), // "pending", "accepted", "rejected"
        read: v.boolean(),
        createdAt: v.number(),
    }).index("by_thread", ["threadId"]),

    threads: defineTable({
        listingId: v.id("listings"),
        buyerId: v.string(),
        sellerId: v.string(),
        lastMessage: v.optional(v.string()),
        lastMessageTime: v.number(),
        hasUnread: v.boolean(),
    })
        .index("by_buyer", ["buyerId"])
        .index("by_seller", ["sellerId"])
        .index("by_listing", ["listingId"]),

    favorites: defineTable({
        userId: v.string(),
        listingId: v.id("listings"),
    }).index("by_user", ["userId"]),

    reviews: defineTable({
        reviewerId: v.string(),
        targetId: v.string(), // Seller being reviewed
        listingId: v.optional(v.id("listings")),
        rating: v.number(),
        comment: v.string(),
        createdAt: v.number(),
    }).index("by_target", ["targetId"]),
});
