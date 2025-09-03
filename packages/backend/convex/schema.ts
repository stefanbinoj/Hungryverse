import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  restaurants: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    googleReviewURL: v.string(),
    imageUrl: v.optional(v.id("_storage")),
    isAllowed: v.boolean(),
  }),

  settings: defineTable({
    resturantId: v.id("restaurants"),
    minValue: v.number(),
    allowRedirection: v.boolean(),
    allowCouponCodeGeneration: v.boolean(),
    showImage: v.boolean(),
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
    //createdAtDesc: -Date.now(), // 👈 new field for descending sort
  }),

  couponCodes: defineTable({
    couponCode: v.string(),
    restaurantId: v.id("restaurants"),
    used: v.boolean(),
    phoneNumber: v.string(),
    responseId: v.id("responses"),
    //createdAtDesc: -Date.now(), // 👈 new field for descending sort
  }),
});
