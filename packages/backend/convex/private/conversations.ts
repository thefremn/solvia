import {mutation, query} from "../_generated/server";
import {v, ConvexError} from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator, PaginationResult } from "convex/server";
import { MessageDoc } from "@convex-dev/agent";
import { Doc } from "../_generated/dataModel";

export const updateStatus = mutation({
    args: {
        conversationId: v.id("conversations"),
        status: v.union(
            v.literal("unresolved"),
            v.literal("escalated"),
            v.literal("resolved")
        ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(identity === null) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identiy not found",
            });
        }

        const orgId = identity.orgId as string;

        if(!orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization not found",
            });
        }

        const conversation = await ctx.db.get(args.conversationId);

        if(!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found"
            });
        }

        if(conversation.organizationId !== orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid Organization ID",
            });
        }

        await ctx.db.patch(args.conversationId, {
            status: args.status,
        });
    },
});

export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    // Identity may not be ready on initial render — MUST return null instead of throwing
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const orgId = identity.orgId as string;
    if (!orgId) {
      return null;
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      return null;
    }

    if (conversation.organizationId !== orgId) {
      return null;
    }

    const contactSession = await ctx.db.get(conversation.contactSessionId);
    if (!contactSession) {
      return null;
    }

    return {
      ...conversation,
      contactSession,
    };
  },
});

export const getMany = query({
    args: {
        paginationOpts: paginationOptsValidator,
        status: v.optional(v.union(
            v.literal("unresolved"),
            v.literal("escalated"),
            v.literal("resolved"),
        )),
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

        let conversations: PaginationResult<Doc<"conversations">>;
        
        if(args.status){
            conversations = await ctx.db.query("conversations")
            .withIndex("by_status_and_organization_id", (q) =>
                q.eq("status", args.status as Doc<"conversations">["status"],)
                .eq("organizationId", orgId)
            )
            .order("desc")
            .paginate(args.paginationOpts);
        }else {
            conversations = await ctx.db.query("conversations")
            .withIndex("by_organization_id", (q) =>
                q.eq("organizationId", orgId)
            )
            .order("desc")
            .paginate(args.paginationOpts);
        }
        const conversationWithAdditionalData = await Promise.all(
            conversations.page.map(async (conversation) => {
                let lastMessage: MessageDoc | null = null;

                const contactSession = await ctx.db.get(conversation.contactSessionId);
                if(!contactSession) {
                   return null;
                }
                const message = await supportAgent.listMessages(ctx, {
                    threadId: conversation.threadId,
                    paginationOpts: {
                        numItems: 1,
                        cursor: null },
                });
                if(message.page.length > 0){
                    lastMessage = message.page[0] ?? null;
                }
                return {
                    ...conversation,
                    contactSession,
                    lastMessage,
                }
    })  
        )

        const validConversations = conversationWithAdditionalData.filter((conv): conv is NonNullable<typeof conv> => conv !== null);
        return {
            ...conversations,
            page: validConversations,
        };
    },
});

