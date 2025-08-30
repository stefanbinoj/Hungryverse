import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    restrurants: defineTable({
        userId: v.string(),
        name: v.string(),
        imageUrl: v.optional(v.string()),  
    }),

    forms: defineTable({    
        restrurantId: v.id("restrurants"),
    }),

    responses: defineTable({
        restrurantId: v.id("restrurants"),
        formId: v.id("forms"),
        deleted: v.boolean(),
    }),


});
