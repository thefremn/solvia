import {ConvexError, v} from "convex/values";
import {action, query} from "../_generated/server";
import {internal, components} from "../_generated/api";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { escalateConversation } from "../system/ai/tools/escalateConversation";
import { resolveConversation } from "../system/ai/tools/resolveConversation";
import type { ToolSet } from "ai";
import { saveMessage } from "@convex-dev/agent";

export const create = action({
    args: {
        prompt: v.string(),
        threadId: v.string(),
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        const contactSession = await ctx.runQuery(
            internal.system.contactSessions.getOne,
            {
                contactSessionId: args.contactSessionId,
            }
        );

        if(!contactSession || contactSession.expiresAt < Date.now()){
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid session",
            })
        }

        const conversation = await ctx.runQuery(
            internal.system.conversations.getByThreadId,
            {
                threadId: args.threadId,
            },
        );

        if(!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found",
            });
        }

        if(conversation.status === "resolved"){
            throw new ConvexError({
                code: "BAD_REQUEST",
                message: "Conversation resolved",
            });
        }

        const shouldTriggerAgent = 
            conversation.status === "unresolved";


        if(shouldTriggerAgent) {
            await supportAgent.generateText(
                ctx,
                {threadId: args.threadId},
                {
                    prompt: args.prompt,
                    tools: {
                        escalateConversation,
                        resolveConversation,  
                    } satisfies ToolSet
                }
            )
        } else {
            await saveMessage(ctx, components.agent,{
                threadId: args.threadId,
                prompt: args.prompt,
            });
        }
    },
});

export const getMany = query({
    args: {
        threadId: v.string(),
        contactSessionId: v.id("contactSessions"),  // ✅ Add back
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        // ✅ Validate contact session (for widget)
        const contactSession = await ctx.db.get(args.contactSessionId);
        if(!contactSession || contactSession.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid session",
            });
        }

        const conversation = await ctx.db
            .query("conversations")
            .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
            .unique();
        
        if(!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found",
            });
        }

        // ✅ Verify conversation belongs to contact session
        if(conversation.contactSessionId !== args.contactSessionId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Incorrect session",
            });
        }

        const paginated = await supportAgent.listMessages(ctx, {
            threadId: args.threadId,
            paginationOpts: args.paginationOpts,
        });

        return paginated; 
    }
});