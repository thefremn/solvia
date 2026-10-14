"use client";

import {useAtomValue, useSetAtom} from "jotai";
import { ChevronRightIcon, MicIcon, PhoneIcon, SendHorizontalIcon } from "lucide-react";
import {conversationIdAtom, errorMessageAtom, hasVapiSecretsAtom, pendingMessageAtom, widgetSettingsAtom} from "@/modules/widget/atoms/widget-atoms";
import { Button } from "@workspace/ui/components/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@workspace/ui/components/input-group";
import { contactSessionIdAtomFamily, organizationIdAtom, screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState, type FormEvent } from "react";
import { WidgetFooter } from "../components/widget-footer";

export const WidgetSelectionScreen = () => {

    const setScreen = useSetAtom(screenAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setConversationId = useSetAtom(conversationIdAtom);
    const setPendingMessage = useSetAtom(pendingMessageAtom);

    const widgetSettings = useAtomValue(widgetSettingsAtom);
    const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);
    const organizationId = useAtomValue(organizationIdAtom);
    const contactSessionId = useAtomValue(
        contactSessionIdAtomFamily(organizationId || "")
    );

    const createConversation = useMutation(api.public.conversations.create);
    const [isPending, setIsPending] = useState(false);
    const [question, setQuestion] = useState("");

    const handleNewConversation = async (initialMessage?: string) => {

        if(!organizationId){
            setScreen("error");
            setErrorMessage("Missing Organization ID")
            return;
        }

        if(!contactSessionId){
            setScreen("auth");
            return;
        }

        setIsPending(true);
        try {
            const conversationId = await createConversation({
                contactSessionId,
            });
            setConversationId(conversationId);
            if(initialMessage?.trim()){
                setPendingMessage(initialMessage.trim());
                setQuestion("");
            }
            setScreen("chat");
        } catch {
            setScreen("auth");
        } finally {
            setIsPending(false);
        }
    };

    const handleAskSubmit = (event: FormEvent) => {
        event.preventDefault();
        if(!question.trim() || isPending){
            return;
        }
        void handleNewConversation(question);
    };

    return (
        <>
            <div className="bg-foreground px-5 pt-6 pb-8 text-background">
                <h1 className="text-2xl font-bold leading-tight">
                    Hi there!
                    <span className="block">How can we help?</span>
                </h1>
            </div>
            <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto bg-muted/50 p-4">
                <form className="-mt-9" onSubmit={handleAskSubmit}>
                    <InputGroup className="h-11 rounded-full bg-card shadow-sm">
                        <InputGroupInput
                            aria-label="Ask a question"
                            onChange={(event) => setQuestion(event.target.value)}
                            placeholder="Ask a question"
                            value={question}
                        />
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton
                                aria-label="Send question"
                                disabled={!question.trim() || isPending}
                                size="icon-sm"
                                type="submit"
                            >
                                <SendHorizontalIcon className="text-primary" />
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </form>
                {hasVapiSecrets && widgetSettings?.vapiSettings?.assistantId && (
                <Button className="h-16 w-full justify-between" variant="outline" onClick={() => handleNewConversation()} disabled={isPending}>
                    <div className="flex items-center gap-x-2">
                        <MicIcon className="size-4" />
                            <span>Start voice call</span>
                    </div>
                    <ChevronRightIcon />
                </Button>
                )}
                {hasVapiSecrets && widgetSettings?.vapiSettings?.phoneNumber && (
                <Button className="h-16 w-full justify-between" variant="outline" onClick={() => setScreen("contact")} disabled={isPending}>
                    <div className="flex items-center gap-x-2">
                        <PhoneIcon className="size-4" />
                            <span>Call us</span>
                    </div>
                    <ChevronRightIcon />
                </Button>
                )}
            </div>
            <WidgetFooter />
        </>
    )
}
