import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: { threadId: v.id("threads") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
            .order("asc")
            .collect();
    },
});

export const send = mutation({
    args: {
        threadId: v.id("threads"),
        content: v.string(),
        type: v.optional(v.string()), // "text" default
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        await ctx.db.insert("messages", {
            threadId: args.threadId,
            senderId: identity.subject,
            content: args.content,
            type: args.type || "text",
            read: false,
            createdAt: Date.now(),
        });

        // Update thread last message
        await ctx.db.patch(args.threadId, {
            lastMessage: args.content,
            lastMessageTime: Date.now(),
            hasUnread: true,
        });
    },
});

export const createThread = mutation({
    args: { listingId: v.id("listings"), sellerId: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        // Check if thread exists
        const existing = await ctx.db
            .query("threads")
            .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
            .filter((q) =>
                q.and(
                    q.eq(q.field("buyerId"), identity.subject),
                    q.eq(q.field("sellerId"), args.sellerId)
                )
            )
            .first();

        if (existing) return existing._id;

        return await ctx.db.insert("threads", {
            listingId: args.listingId,
            buyerId: identity.subject,
            sellerId: args.sellerId,
            lastMessageTime: Date.now(),
            hasUnread: false,
        });
    },
});

export const getThreads = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const asBuyer = await ctx.db
            .query("threads")
            .withIndex("by_buyer", (q) => q.eq("buyerId", identity.subject))
            .collect();

        const asSeller = await ctx.db
            .query("threads")
            .withIndex("by_seller", (q) => q.eq("sellerId", identity.subject))
            .collect();

        const allThreads = [...asBuyer, ...asSeller].sort((a, b) => b.lastMessageTime - a.lastMessageTime);

        return await Promise.all(allThreads.map(async (thread) => {
            const isBuyer = thread.buyerId === identity.subject;
            const otherUserId = isBuyer ? thread.sellerId : thread.buyerId;

            const otherUser = await ctx.db
                .query("users")
                .withIndex("by_token", (q) => q.eq("tokenIdentifier", otherUserId))
                .unique();

            const listing = await ctx.db.get(thread.listingId);

            return {
                ...thread,
                otherUserName: otherUser?.name || "Unknown",
                otherUserAvatar: otherUser?.avatar || "",
                listingTitle: listing?.title || "Unknown Listing",
                listingImage: listing?.images[0] || "",
            };
        }));
    },
});
