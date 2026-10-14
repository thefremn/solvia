import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface ConversationStatusIconProps {
  status: "unresolved" | "escalated" | "resolved";
  className?: string;
}

const statusConfig = {
  resolved: {
    icon: CheckIcon,
    bgColor: "bg-green-100",
    iconColor: "text-green-700",
  },

  unresolved: {
    icon: ArrowRightIcon,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },

  escalated: {
    icon: ArrowUpIcon,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-700",
  },
} as const;

export const ConversationStatusIcon = ({
  status,
  className,
}: ConversationStatusIconProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full size-5",
        config.bgColor,
        className,
      )}
    >
      <Icon className={cn("size-3 stroke-3", config.iconColor)} />
    </div>
  );
};
