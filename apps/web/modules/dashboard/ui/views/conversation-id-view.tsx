"use client";

import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { useMutation, useQuery, useAction } from "convex/react";

import { Button } from "@workspace/ui/components/button";
import { ChevronLeft, Wand2Icon } from "lucide-react";
import Link from "next/link";

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
    { initialNumItems: 10 },
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

  const uiMessages = toUIMessages(messages.results ?? []);
  const contactName = conversation?.contactSession?.name;
  const contactEmail = conversation?.contactSession?.email;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* HEADER */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-3">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/conversations" aria-label="Back to conversations">
            <ChevronLeft />
          </Link>
        </Button>

        {conversation ? (
          <div className="flex min-w-0 items-center gap-2.5">
            <DicebearAvatar
              seed={conversation.contactSessionId}
              size={32}
              className="shrink-0"
            />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm leading-5 font-semibold text-foreground">
                {contactName || "Unknown visitor"}
              </span>
              {contactEmail && (
                <span className="truncate text-[11px] leading-4 text-muted-foreground">
                  {contactEmail}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="size-8 shrink-0 animate-pulse rounded-full bg-muted" />
            <div className="flex flex-col gap-1">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        )}

        <div className="ml-auto shrink-0">
          {conversation ? (
            <ConversationStatusButton
              status={conversation.status}
              disabled={form.formState.isSubmitting}
              onClick={handleStatusChange}
            />
          ) : (
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
          )}
        </div>
      </header>

      {/* MESSAGES */}
      <AIConversation className="min-h-0 flex-1">
        <AIConversationContent className="flex flex-col gap-1 p-4">
          {uiMessages.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No messages yet. New messages will appear here in real time.
            </p>
          )}
          {uiMessages.map((message) => {
            const isVisitor = message.role === "user";
            return (
              <AIMessage
                key={message.id}
                from={isVisitor ? "assistant" : "user"}
              >
                <AIMessageContent
                  className={
                    isVisitor
                      // Received (visitor) bubble — clearly visible on both themes.
                      ? "rounded-xl rounded-tl-sm border-border bg-muted text-foreground shadow-xs"
                      // Sent (operator) bubble — bg-none! cancels the template
                      // gradient (variant classes outrank plain utilities).
                      : "rounded-xl rounded-tr-sm border-transparent bg-none! bg-brand-accent-fill text-white shadow-xs"
                  }
                >
                  <AIResponse>{message.content}</AIResponse>
                </AIMessageContent>

                {isVisitor ? (
                  <DicebearAvatar
                    seed={conversation?.contactSessionId ?? ""}
                    size={32}
                  />
                ) : null}
              </AIMessage>
            );
          })}
        </AIConversationContent>

        <AIConversationScrollButton />
      </AIConversation>

      {/* INPUT */}
      <div className="shrink-0 border-t border-border bg-background p-3">
        <Form {...form}>
          <AIInput
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-1 rounded-xl border-border bg-card p-1.5 pl-2 shadow-xs"
          >
            <AIInputButton
              disabled={
                !form.getValues("message") || form.formState.isSubmitting
              }
              onClick={async () => {
                const original = form.getValues("message");
                if (!original) return;

                try {
                  const enhanced = await enhanceMsg({ prompt: original });
                  form.setValue("message", enhanced);
                } catch (error) {
                  toast.error("Something went wrong");
                  console.error("Enhance error:", error);
                }
              }}
              aria-label="Enhance response"
              title="Enhance response"
              className="shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Wand2Icon data-icon="inline-start" />
              Enhance
            </AIInputButton>

            {/* TEXTAREA */}
            <FormField
              control={form.control}
              name="message"
              disabled={conversation?.status === "resolved"}
              render={({ field }) => (
                <AIInputTextarea
                  value={field.value}
                  onChange={field.onChange}
                  minHeight={40}
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
                  className="min-w-0 flex-1 text-foreground placeholder:text-muted-foreground"
                />
              )}
            />

            {/* SUBMIT */}
            <AIInputSubmit
              disabled={
                conversation?.status === "resolved" ||
                !form.formState.isValid ||
                form.formState.isSubmitting
              }
              status={form.formState.isSubmitting ? "submitted" : "ready"}
              type="submit"
              aria-label="Send message"
              className="shrink-0 rounded-lg bg-primary text-white shadow-none hover:bg-primary/90 hover:text-white disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
            />
          </AIInput>
        </Form>
      </div>
    </div>
  );
};
