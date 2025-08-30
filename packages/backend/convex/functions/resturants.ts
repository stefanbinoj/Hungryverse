import {query,mutation} from "../_generated/server";
import {v} from "convex/values";

export const createResturant = mutation({
  args: {
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const newResturantId = await ctx.db.insert("restrurants", {
      userId: ctx.auth.userId , 
      name: args.name,
      imageUrl: args.imageUrl,
    });
    return await ctx.db.get(newResturantId);
  },
});

export const getResturantsByUser = query({
  handler: async (ctx, args) => {       
    return await ctx.db
      .query("restrurants")
      .withIndex("byUser", (q) => q.eq("userId", ctx.auth.userId))
      .collect();
  },
});
