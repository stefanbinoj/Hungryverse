import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const checkRestaurantExists = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        console.log("identity", identity);
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const existingRestaurant = await ctx.db
            .query("restaurants")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .first();

        return !!existingRestaurant;
    },
});

export const createResturant = mutation({
    args: {
        name: v.string(),
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const newResturantId = await ctx.db.insert("restaurants", {
            userId: identity.subject, // Clerk user ID here
            name: args.name,
            imageUrl: args.imageUrl,
            isAllowed: false, // Default to false
        });

        return await ctx.db.get(newResturantId);
    },
});
