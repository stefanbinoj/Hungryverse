import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const createResponse = mutation({
    args: {
        restrurantId: v.id("restaurants"),
        foodRating: v.number(),
        serviceRating: v.number(),
        ambianceRating: v.number(),
        cleanlinessRating: v.number(),
        description: v.optional(v.string()),
        phoneNumber: v.string(),
    },
    handler: async (ctx, args) => {
        const newResponse = {
            restrurantId: args.restrurantId,
            foodRating: args.foodRating,
            serviceRating: args.serviceRating,
            ambianceRating: args.ambianceRating,
            cleanlinessRating: args.cleanlinessRating,
            description: args.description || "",
            deleted: false,
            phoneNumber: args.phoneNumber,
        };
        const responseId = await ctx.db.insert("responses", newResponse);
        console.log("Created new response with ID:", responseId);
        return responseId;
    },
});

export const getResponsesByRestaurant = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const restaurant = await ctx.db
            .query("restaurants")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .first();

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        return await ctx.db
            .query("responses")
            .filter((q) =>
                q.and(
                    q.eq(q.field("restrurantId"), restaurant._id),
                    q.eq(q.field("deleted"), false),
                ),
            )
            .collect();
    },
});

export const deleteResponse = mutation({
    args: {
        responseId: v.id("responses"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const restaurant = await ctx.db
            .query("restaurants")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .first();

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        const response = await ctx.db.get(args.responseId);
        if (!response || response.restrurantId!== restaurant._id) {
            throw new Error("Response not found or does not belong to your restaurant");
        }

        await ctx.db.patch(args.responseId, { deleted: true });
        return true;
    },
});
