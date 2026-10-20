import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface ConversationStatusIconProps {
  status: "unresolved" | "escalated" | "resolved";
  className?: string;
}

const statusConfig = {
  resolved: {
    icon: CheckIcon,
    bgColor: "bg-green-100 dark:bg-green-500/15",
    iconColor: "text-green-700 dark:text-green-400",
  },

  unresolved: {
    icon: ArrowRightIcon,
    bgColor: "bg-red-100 dark:bg-red-500/15",
    iconColor: "text-red-600 dark:text-red-400",
  },

  escalated: {
    icon: ArrowUpIcon,
    bgColor: "bg-amber-100 dark:bg-amber-500/15",
    iconColor: "text-amber-700 dark:text-amber-400",
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
