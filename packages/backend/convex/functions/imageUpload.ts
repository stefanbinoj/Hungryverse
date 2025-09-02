import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
  const url =  await ctx.storage.generateUploadUrl();
        console.log("Generating upload URL", url);
    return url;
  },
});

export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
