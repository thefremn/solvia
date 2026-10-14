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
import { CheckIcon, MailIcon } from "lucide-react";

const PRO_FEATURES = [
  "AI Customer Support",
  "AI Voice Agent",
  "Phone System",
  "Knowledge Base",
  "Team Access (up to 5 operators)",
  "Widget Customization",
];

export const PricingTable = () => {
  const { organization } = useOrganization();

  const handleContactUs = () => {
    const orgId = organization?.id || "";
    const subject = encodeURIComponent("Upgrade to Pro Plan Request");
    const body = encodeURIComponent(
      `Organization ID: ${orgId}\n\nPlease upgrade my organization to Pro plan.`,
    );
    const mailtoLink = `mailto:thefremn@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="w-full border-[#E2E8F0] bg-white shadow-xs">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl leading-tight font-bold text-[#0F172A]">
          Upgrade to Pro
        </CardTitle>
        <CardDescription className="text-sm text-[#475569]">
          Contact us to upgrade your organization to Pro plan
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-[#475569]">
            Pro plan includes all premium features:
          </p>
          <ul className="flex flex-col gap-1.5">
            {PRO_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-[#0F172A]"
              >
                <CheckIcon className="size-4 shrink-0 text-green-700" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <Button className="w-full" onClick={handleContactUs} size="lg">
          <MailIcon data-icon="inline-start" />
          Contact Us
        </Button>
      </CardContent>
    </Card>
  );
};
