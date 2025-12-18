"use client";

import { useOrganization } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { MailIcon } from "lucide-react";

export const PricingTable = () => {
    const { organization } = useOrganization();

    const handleContactUs = () => {
        const orgId = organization?.id || "";
        const subject = encodeURIComponent("Upgrade to Pro Plan Request");
        const body = encodeURIComponent(
            `Organization ID: ${orgId}\n\nPlease upgrade my organization to Pro plan.`
        );
        const mailtoLink = `mailto:thefremn@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
    };

    return (
        <Card className="w-full">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Upgrade to Pro</CardTitle>
                    <CardDescription>
                        Contact us to upgrade your organization to Pro plan
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Pro plan includes all premium features:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li>AI Customer Support</li>
                            <li>AI Voice Agent</li>
                            <li>Phone System</li>
                            <li>Knowledge Base</li>
                            <li>Team Access (up to 5 operators)</li>
                            <li>Widget Customization</li>
                        </ul>
                    </div>
                    <Button
                        className="w-full"
                        onClick={handleContactUs}
                        size="lg"
                    >
                        <MailIcon className="mr-2 h-4 w-4" />
                        Contact Us
                    </Button>
                </CardContent>
            </Card>
    );
};