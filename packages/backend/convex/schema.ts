import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    restaurants: defineTable({
        userId: v.string(),
        name: v.string(),
        email: v.string(),
        imageUrl: v.optional(v.string()),
        minValue: v.number(),
        allowRedirection: v.boolean(),
        allowCouponCodeGeneration: v.boolean(),
        isAllowed: v.boolean(),
    }),

    responses: defineTable({
        restrurantId: v.id("restaurants"),
        foodRating: v.number(),
        serviceRating: v.number(),
        ambianceRating: v.number(),
        cleanlinessRating: v.number(),
        description: v.optional(v.string()),
        deleted: v.boolean(),
        couponCode: v.optional(v.string()),
        phoneNumber: v.string(),
    }),
});
