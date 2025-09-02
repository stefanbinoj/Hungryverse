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

        const settings = await ctx.db
            .query("settings")
            .filter((q) => q.eq(q.field("resturantId"), restaurant._id))
            .first();

        return settings || {
            resturantId: restaurant._id,
            minValue: 0,
            allowRedirection: false,
            allowCouponCodeGeneration: false,
            showImage: true,
        };
    },
});

export const updateRestaurantSettings = mutation({
    args: {
        minValue: v.optional(v.number()),
        allowRedirection: v.optional(v.boolean()),
        allowCouponCodeGeneration: v.optional(v.boolean()),
        showImage: v.optional(v.boolean()),
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
            showImage?: boolean;
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
        if (args.showImage !== undefined) {
            updatedFields.showImage = args.showImage;
        }

        const existingSettings = await ctx.db
            .query("settings")
            .filter((q) => q.eq(q.field("resturantId"), restaurant._id))
            .first();
        if (existingSettings) {
            await ctx.db.patch(existingSettings._id, updatedFields);
            return await ctx.db.get(existingSettings._id);
        } else {
            const newSettingsId = await ctx.db.insert("settings", {
                resturantId: restaurant._id,
                minValue: args.minValue ?? 0,
                allowRedirection: args.allowRedirection ?? false,
                allowCouponCodeGeneration: args.allowCouponCodeGeneration ?? false,
                showImage: true,
            });
            return await ctx.db.get(newSettingsId);
        }
    },
});
