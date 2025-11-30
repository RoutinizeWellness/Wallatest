import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: { targetId: v.string() },
    handler: async (ctx, args) => {
        // We need to join with reviewer info
        const reviews = await ctx.db
            .query("reviews")
            .withIndex("by_target", (q) => q.eq("targetId", args.targetId))
            .collect();

        return await Promise.all(reviews.map(async (r) => {
            const reviewer = await ctx.db
                .query("users")
                .withIndex("by_token", (q) => q.eq("tokenIdentifier", r.reviewerId))
                .unique();
            return {
                ...r,
                reviewerName: reviewer?.name || "Unknown",
                reviewerAvatar: reviewer?.avatar || "",
            };
        }));
    },
});

export const create = mutation({
    args: {
        targetId: v.string(),
        rating: v.number(),
        comment: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        await ctx.db.insert("reviews", {
            reviewerId: identity.subject,
            targetId: args.targetId,
            rating: args.rating,
            comment: args.comment,
            createdAt: Date.now(),
        });

        // Update user stats (rating, reviewCount)
        // This is expensive to do on every review if we recalculate average.
        // For now, let's just increment count and update average roughly or skip it.
        // Let's skip updating user stats for now to keep it simple, or do a simple increment.

        // We can fetch the user and update.
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.targetId))
            .unique();

        if (user) {
            const newCount = (user.reviewCount || 0) + 1;
            const currentTotal = (user.rating || 0) * (user.reviewCount || 0);
            const newRating = (currentTotal + args.rating) / newCount;

            await ctx.db.patch(user._id, {
                reviewCount: newCount,
                rating: newRating,
            });
        }
    },
});
