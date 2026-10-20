import { ArrowLeftRightIcon, type LucideIcon, PlugIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";

export interface Feature {
  icon: LucideIcon;
  label: string;
  description: string;
}

interface PluginCardProps {
  isDisabled?: boolean;
  serviceName: string;
  serviceImage: string;
  features: Feature[];
  onSubmit: () => void;
}

export const PluginCard = ({
  isDisabled,
  serviceName,
  serviceImage,
  features,
  onSubmit,
}: PluginCardProps) => {
  return (
    <div className="h-fit w-full rounded-xl border border-[#E2E8F0] bg-white p-8 shadow-xs">
      <div className="mb-6 flex items-center justify-center gap-6">
        <div className="flex flex-col items-center">
          <Image
            alt={serviceName}
            className="rounded object-contain"
            height={40}
            width={40}
            src={serviceImage}
          />
        </div>
        <div className="flex flex-col items-center">
          <ArrowLeftRightIcon className="size-5 text-[#94A3B8]" />
        </div>
        <div className="flex flex-col items-center">
          <Image
            alt="Platform"
            className="object-contain"
            height={40}
            width={40}
            src="/logo.svg"
          />
        </div>
      </div>
      <div className="mb-6 text-center">
        <p className="text-base font-semibold text-[#0F172A]">
          Connect your {serviceName} account
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col gap-4">
          {features.map((feature) => (
            <div className="flex items-center gap-3" key={feature.label}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F1F5F9]">
                <feature.icon className="size-4 text-[#475569]" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[#0F172A]">
                  {feature.label}
                </div>
                <div className="text-xs text-[#475569]">
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <Button
          className="size-full"
          disabled={isDisabled}
          onClick={onSubmit}
          variant="default"
        >
          Connect
          <PlugIcon />
        </Button>
      </div>
    </div>
  );
};
