import {v} from "convex/values";
import {mutation, query} from "../_generated/server";
import { ConvexError } from "convex/values";

export const remove = mutation({
    args: {
        service: v.union(v.literal("vapi"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
                if(!identity) {
                    throw new ConvexError({
                        code:"UNAUTHORIZED",
                        message:"Identity not found",
                    }
                    );
                }
                const orgId = identity.orgId as string ;
                if(!orgId) {
                    throw new ConvexError({
                        code:"UNAUTHORIZED",
                        message:"Organization ID not found",
                    });
                }
        
                const existingPlugin =  await ctx.db
                    .query("plugins")
                    .withIndex("by_organization_id_and_service", (q) => 
                        q.eq("organizationId", orgId).eq("service", args.service)
                    )
                    .unique();

                if(!existingPlugin) {
                    throw new ConvexError({
                        code: "NOT_FOUND",
                        message: "Plugin not found"
                    });
                }

                await ctx.db.delete(existingPlugin._id);
    },
});

export const getOne = query({
    args: {
        service: v.union(v.literal("vapi"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
                if(!identity) {
                    throw new ConvexError({
                        code:"UNAUTHORIZED",
                        message:"Identity not found",
                    }
                    );
                }
                const orgId = identity.orgId as string ;
                if(!orgId) {
                    throw new ConvexError({
                        code:"UNAUTHORIZED",
                        message:"Organization ID not found",
                    });
                }
        
                return await ctx.db
                    .query("plugins")
                    .withIndex("by_organization_id_and_service", (q) => 
                        q.eq("organizationId", orgId).eq("service", args.service)
                    )
                    .unique();
    },
});