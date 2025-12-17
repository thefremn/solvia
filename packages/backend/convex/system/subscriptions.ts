import {v} from "convex/values";
import {internalMutation, internalQuery, query} from "../_generated/server";

export const upsert = internalMutation({
    args: {
        organizationId: v.string(),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const existingSubscriptions = await ctx.db
            .query("subscriptions")
            .withIndex("by_organization_id", (q) => 
                q.eq("organizationId", args.organizationId),
            )
            .unique();

        if (existingSubscriptions) {
            await ctx.db.patch(existingSubscriptions._id, {
                status: args.status,
            });
        } else {
            await ctx.db.insert("subscriptions", {
                organizationId: args.organizationId,
                status: args.status,
            })
        }
    },
});

export const getByOrganizationId = internalQuery({
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