import { v } from "convex/values";
import { query } from "../_generated/server";

export const getSubscription = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("subscriptions")
            .withIndex("by_organization_id", (q) => 
                q.eq("organizationId", args.organizationId)
            )
            .unique();
    },
});

