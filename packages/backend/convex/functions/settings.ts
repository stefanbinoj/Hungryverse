import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const getRestaurantSettings = query({ 
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

        return {
            minValue: restaurant?.minValue,
            allowRedirection: restaurant?.allowRedirection,
            allowCouponCodeGeneration: restaurant?.allowCouponCodeGeneration,
        };
    },
});

export const updateRestaurantSettings = mutation({
    args: {
        minValue: v.optional(v.number()),
        allowRedirection: v.optional(v.boolean()),
        allowCouponCodeGeneration: v.optional(v.boolean()),
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

        const updatedFields: {
            minValue?: number;
            allowRedirection?: boolean;
            allowCouponCodeGeneration?: boolean;
        } = {};

        if (args.minValue !== undefined) {
            updatedFields.minValue = args.minValue;
        }
        if (args.allowRedirection !== undefined) {
            updatedFields.allowRedirection = args.allowRedirection;
        }
        if (args.allowCouponCodeGeneration !== undefined) {
            updatedFields.allowCouponCodeGeneration = args.allowCouponCodeGeneration;
        }

        await ctx.db.patch(restaurant._id, updatedFields);

        return await ctx.db.get(restaurant._id);
    },
});
