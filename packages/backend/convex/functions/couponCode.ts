import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const saveCouponCode = mutation({
    args: {
        couponCode: v.string(),
        responseId: v.id("responses"),
        phoneNumber: v.string(),
    },
    handler: async (ctx, args) => {
        const Response = await ctx.db
            .query("responses")
            .filter((q) => q.eq(q.field("_id"), args.responseId))
            .first();
        if (!Response) {
            throw new Error("Response not found");
        }
        const restaurantId = Response.restrurantId;

        await ctx.db.insert("couponCodes", {
            restaurantId: restaurantId,
            responseId: args.responseId,
            couponCode: args.couponCode,
            phoneNumber: args.phoneNumber,
            used: false,
        });
        return { success: true };
    },
});
