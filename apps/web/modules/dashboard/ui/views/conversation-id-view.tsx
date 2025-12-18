"use client";

import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { useMutation, useQuery, useAction } from "convex/react";

import { Button } from "@workspace/ui/components/button";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";

import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";

import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";

import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";

import { AIResponse } from "@workspace/ui/components/ai/response";
import { FormField, Form } from "@workspace/ui/components/form";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { ConversationStatusButton } from "../components/conversation-status-button";
import { toast } from "sonner";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const ConversationIdView = ({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) => {
  // -------------------------------
  // QUERIES
  // -------------------------------
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  });

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: 10 }
  );

  // -------------------------------
  // FORM
  // -------------------------------
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  // -------------------------------
  // MUTATIONS / ACTIONS
  // -------------------------------
  const createMessage = useMutation(api.private.messages.create);
  const updateStatus = useMutation(api.private.conversations.updateStatus);
  const enhanceMsg = useAction(api.private.messages.enhanceResponse);

  // -------------------------------
  // SEND MESSAGE HANDLER
  // -------------------------------
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMessage({
        conversationId,
        prompt: values.message,
      });

      form.reset(); // Clears controlled input
    } catch (error) {
      console.log(error);
    }
  };

  // -------------------------------
  // STATUS TOGGLE
  // -------------------------------
  const handleStatusChange = () => {
    if (!conversation) return;

    const next =
      conversation.status === "resolved"
        ? "unresolved"
        : conversation.status === "escalated"
        ? "resolved"
        : "escalated";

    updateStatus({
      conversationId,
      status: next,
    });
  };

  return (
    <div className="flex h-full flex-col bg-muted overflow-hidden">

      {/* HEADER */}
      <header className="flex items-center justify-between border-b bg-background p-2.5 shrink-0">
        <Button size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>

        {conversation ? (
          <ConversationStatusButton
            status={conversation.status}
            disabled={form.formState.isSubmitting}
            onClick={handleStatusChange}
          />
        ) : (
          <div className="w-24 h-8 rounded-md bg-muted animate-pulse" />
        )}
      </header>

      {/* MESSAGES */}
      <AIConversation className="flex-1 min-h-0">
        <AIConversationContent>
          {toUIMessages(messages.results ?? []).map((message) => (
            <AIMessage
              key={message.id}
              from={message.role === "user" ? "assistant" : "user"}
            >
              <AIMessageContent>
                <AIResponse>{message.content}</AIResponse>
              </AIMessageContent>

              {message.role === "user" ? (
                <DicebearAvatar
                  seed={conversation?.contactSessionId ?? ""}
                  size={32}
                />
              ) : null}
            </AIMessage>
          ))}
        </AIConversationContent>

        <AIConversationScrollButton />
      </AIConversation>

      {/* INPUT */}
      <div className="p-2 shrink-0">
        <Form {...form}>
          <AIInput onSubmit={form.handleSubmit(onSubmit)}>

            {/* TEXTAREA */}
            <FormField
              control={form.control}
              name="message"
              disabled={conversation?.status === "resolved"}
              render={({ field }) => (
                <AIInputTextarea
                  value={field.value}   // <-- FIXED (controlled!)
                  onChange={field.onChange}
                  disabled={
                    conversation?.status === "resolved" ||
                    form.formState.isSubmitting
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  placeholder={
                    conversation?.status === "resolved"
                      ? "Conversation resolved"
                      : "Type your response as an operator..."
                  }
                />
              )}
            />

            {/* TOOLBAR */}
            <AIInputToolbar>

              {/* TOOLS */}
              <AIInputTools>
                <AIInputButton
                  disabled={!form.getValues("message") || form.formState.isSubmitting}
                  onClick={async () => {
                    const original = form.getValues("message");
                    if (!original) return;

                    try {
                      const enhanced = await enhanceMsg({ prompt: original });
                      form.setValue("message", enhanced); // <-- Fix: updates the controlled textarea
                    } catch (error) {
                      toast.error("Something went wrong");
                      console.error("Enhance error:", error);
                    }
                  }}
                >
                  <Wand2Icon className="mr-1" />
                  Enhance
                </AIInputButton>
              </AIInputTools>

              {/* SUBMIT */}
              <AIInputSubmit
                disabled={
                  conversation?.status === "resolved" ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting
                }
                status="ready"
                type="submit"
              />

            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
    </div>
  );
};
