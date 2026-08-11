"use client";

import { useQuery } from "convex/react";
import { Authenticated, AuthLoading } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { PremiumFeatureOverlay } from "./premium-feature-overlay";
import { Loader2Icon } from "lucide-react";

interface SubscriptionProtectProps {
    children: React.ReactNode;
}

export const SubscriptionProtect = ({ children }: SubscriptionProtectProps) => {
    return (
        <>
            <AuthLoading>
                <div className="min-h-screen flex items-center justify-center gap-y-2 bg-muted p-8">
                    <Loader2Icon className="text-muted-foreground animate-spin" />
                    <p className="text-muted-foreground text-sm">Loading...</p>
                </div>
            </AuthLoading>
            <Authenticated>
                <SubscriptionProtectContent>{children}</SubscriptionProtectContent>
            </Authenticated>
        </>
    );
};

const SubscriptionProtectContent = ({ children }: { children: React.ReactNode }) => {
    const subscription = useQuery(api.private.subscriptions.getOne);

    const isPro = subscription?.status === "active";

    if (!isPro) {
        return (
            <PremiumFeatureOverlay>
                {children}
            </PremiumFeatureOverlay>
        );
    }

    return <>{children}</>;
};

