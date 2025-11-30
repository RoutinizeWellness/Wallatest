import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {
        category: v.optional(v.string()),
        neighborhood: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let q = ctx.db.query("listings");

        if (args.category && args.category !== "Todos") {
            q = q.withIndex("by_category", (q) => q.eq("category", args.category!));
        }

        let results = await q.order("desc").take(50);

        if (args.neighborhood && args.neighborhood !== "Todos") {
            results = results.filter(r => r.location.name === args.neighborhood);
        }

        // Enrich with seller info
        const listingsWithSeller = await Promise.all(results.map(async (l) => {
            const seller = await ctx.db
                .query("users")
                .withIndex("by_token", (q) => q.eq("tokenIdentifier", l.sellerId))
                .unique();
            return {
                ...l,
                sellerName: seller?.name || "Unknown",
                sellerAvatar: seller?.avatar || "",
                sellerVerified: seller?.isVerified || false,
            };
        }));

        return listingsWithSeller;
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        price: v.number(),
        images: v.array(v.string()),
        category: v.string(),
        condition: v.string(),
        neighborhood: v.string(),
        location: v.object({
            lat: v.number(),
            lng: v.number(),
            name: v.string(),
        }),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const listingId = await ctx.db.insert("listings", {
            ...args,
            sellerId: identity.subject,
            views: 0,
            favorites: 0,
            createdAt: Date.now(),
        });

        return listingId;
    },
});

export const get = query({
    args: { id: v.id("listings") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
