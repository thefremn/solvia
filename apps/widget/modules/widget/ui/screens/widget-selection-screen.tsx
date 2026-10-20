"use client";

import {useAtomValue, useSetAtom} from "jotai";
import { ChevronRightIcon, MicIcon, PhoneIcon, SendHorizontalIcon } from "lucide-react";
import {conversationIdAtom, errorMessageAtom, hasVapiSecretsAtom, widgetSettingsAtom} from "@/modules/widget/atoms/widget-atoms";
import { Button } from "@workspace/ui/components/button";
import { contactSessionIdAtomFamily, organizationIdAtom, screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import { WidgetFooter } from "../components/widget-footer";

export const WidgetSelectionScreen = () => {

    const setScreen = useSetAtom(screenAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setConversationId = useSetAtom(conversationIdAtom);

    const widgetSettings = useAtomValue(widgetSettingsAtom);
    const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);
    const organizationId = useAtomValue(organizationIdAtom);
    const contactSessionId = useAtomValue(
        contactSessionIdAtomFamily(organizationId || "")
    );

    const createConversation = useMutation(api.public.conversations.create);
    const [isPending, setIsPending] = useState(false);

    const handleNewConversation = async () => {

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
            setScreen("chat");
        } catch {
            setScreen("auth");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <WidgetHeader className="px-5 pb-16 pt-6">
                <h1 className="text-2xl font-bold leading-tight">
                    Hi there!
                    <span className="block">How can we help?</span>
                </h1>
            </WidgetHeader>
            <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto bg-muted/50 p-4">
                <Button
                    className="-mt-3 h-11 w-full justify-between rounded-full border-primary/40 bg-card shadow-md shadow-primary/10"
                    disabled={isPending}
                    onClick={handleNewConversation}
                    variant="outline"
                >
                    <span>Ask a question</span>
                    <SendHorizontalIcon className="text-primary" />
                </Button>
                {hasVapiSecrets && (widgetSettings?.vapiSettings?.assistantId || widgetSettings?.vapiSettings?.phoneNumber) && (
                <div className="flex flex-col gap-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">More ways to reach us</p>
                {hasVapiSecrets && widgetSettings?.vapiSettings?.assistantId && (
                <Button className="h-11 w-full justify-between" variant="outline" onClick={() => handleNewConversation()} disabled={isPending}>
                    <div className="flex items-center gap-x-2">
                        <MicIcon className="size-4" />
                            <span>Start voice call</span>
                    </div>
                    <ChevronRightIcon />
                </Button>
                )}
                {hasVapiSecrets && widgetSettings?.vapiSettings?.phoneNumber && (
                <Button className="h-11 w-full justify-between" variant="outline" onClick={() => setScreen("contact")} disabled={isPending}>
                    <div className="flex items-center gap-x-2">
                        <PhoneIcon className="size-4" />
                            <span>Call us</span>
                    </div>
                    <ChevronRightIcon />
                </Button>
                )}
                </div>
                )}
            </div>
            <WidgetFooter />
        </>
    )
}
