import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    restaurants: defineTable({
        userId: v.string(),
        name: v.string(),
        imageUrl: v.optional(v.string()),  
        isAllowed: v.boolean(),
    }),

    forms: defineTable({    
        restrurantId: v.id("restaurants"),
    }),

    responses: defineTable({
        restrurantId: v.id("restaurants"),
        formId: v.id("forms"),
        deleted: v.boolean(),
    }),


});
