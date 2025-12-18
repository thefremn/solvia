import {ConvexError, v} from "convex/values";
import { query } from "../_generated/server";

export const getOneByConversationId = query({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(identity === null) {
            return null; // Return null instead of throwing for queries
        }

        const orgId = identity.orgId as string;

        if(!orgId) {
            return null; // Return null instead of throwing
        }

        const conversation = await ctx.db.get(args.conversationId);

        if(!conversation) {
            return null; // Return null instead of throwing
        }

        if(conversation.organizationId !== orgId) {
            return null; // Return null instead of throwing - user doesn't have access to this conversation
        }

        const contactSession = await ctx.db.get(conversation.contactSessionId);

        return contactSession;
    },
});