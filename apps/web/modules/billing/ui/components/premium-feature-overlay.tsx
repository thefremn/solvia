"use client";

import {
  type LucideIcon,
  BookOpenIcon,
  BotIcon,
  GemIcon,
  MicIcon,
  PaletteIcon,
  PhoneIcon,
  UsersIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

interface Feature {
  icon: LucideIcon;
  label: string;
  description: string;
}

interface PremiumFeatureOverlayProps {
  children: React.ReactNode;
}

const features: Feature[] = [
  {
    icon: BotIcon,
    label: "AI Customer Support",
    description: "Intelligent automated responses 24/7",
  },
  {
    icon: MicIcon,
    label: "AI Voice Agent",
    description: "Natural voice conversations with customer",
  },
  {
    icon: PhoneIcon,
    label: "Phone System",
    description: "Inbound & outbound calling capabilities",
  },
  {
    icon: BookOpenIcon,
    label: "Knowledge Base",
    description: "Train AI on your documentation",
  },
  {
    icon: UsersIcon,
    label: "Team Access",
    description: "Up to 5 operators per organization",
  },
  {
    icon: PaletteIcon,
    label: "Widget Customization",
    description: "Customize your chat widget appearance",
  },
];

export const PremiumFeatureOverlay = ({
  children,
}: PremiumFeatureOverlayProps) => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen">
      {/* Blurred background content */}
      <div className="pointer-events-none blur-[2px] select-none">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/*Upgrade prompt */}
      <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-[#E2E8F0] bg-white shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center">
              <div className="mb-2 inline-flex size-12 items-center justify-center rounded-full border border-[#E2E8F0] bg-[#F1F5F9]">
                <GemIcon className="size-6 text-[#0F2D52]" />
              </div>
            </div>
            <CardTitle className="text-xl leading-snug font-bold text-[#0F172A]">
              Premium Feature
            </CardTitle>
            <CardDescription className="text-sm text-[#475569]">
              This feature requires a Pro subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Feature List */}
            <div className="flex flex-col gap-4">
              {features.map((feature) => (
                <div key={feature.label} className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F1F5F9]">
                    <feature.icon className="size-4 text-[#475569]" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-semibold text-[#0F172A]">
                      {feature.label}
                    </p>
                    <p className="text-xs text-[#475569]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => router.push("/billing")}
              size="lg"
            >
              View Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
