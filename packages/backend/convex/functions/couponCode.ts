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

export const getCouponCodeForRestaurant = query({
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
      .query("couponCodes")
      .filter((q) => q.eq(q.field("restaurantId"), restaurant._id))
      .order("desc")
      .collect();
  },
});

export const toggleUsage = mutation({
  args: {
    couponCodeId: v.id("couponCodes"),
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
    const coupon = await ctx.db.get(args.couponCodeId);
    if (!coupon || coupon.restaurantId !== restaurant._id) {
        throw new Error("Coupon code not found or does not belong to your restaurant");
        }
    await ctx.db.patch(args.couponCodeId, { used: !coupon.used });
    return { success: true };
    },
});
