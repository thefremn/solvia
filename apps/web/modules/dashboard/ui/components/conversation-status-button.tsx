import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { ArrowRightIcon, CheckIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

// Chat status is a fixed contract: identical appearance in light and dark
// (per user request). Uses literal light-mode colours, no dark: variants.
const STATUS_STYLES = {
  resolved:
    "border-[#E2E8F0] bg-white text-green-700 hover:bg-green-100 hover:text-green-700",
  escalated:
    "border-[#E2E8F0] bg-white text-amber-700 hover:bg-amber-100 hover:text-amber-700",
  unresolved:
    "border-[#E2E8F0] bg-white text-red-600 hover:bg-red-100 hover:text-red-600",
} as const;

export const ConversationStatusButton = ({
  status,
  onClick,
  disabled,
}: {
  status: Doc<"conversations">["status"];
  onClick: () => void;
  disabled?: boolean;
}) => {
  // ✅ RESOLVED — green / check
  if (status === "resolved") {
    return (
      <Button
        disabled={disabled}
        onClick={onClick}
        size="sm"
        variant="outline"
        className={cn(STATUS_STYLES.resolved)}
      >
        <CheckIcon data-icon="inline-start" />
        Resolved
      </Button>
    );
  }

  // ✅ ESCALATED — amber / UP ARROW
  if (status === "escalated") {
    return (
      <Button
        disabled={disabled}
        onClick={onClick}
        size="sm"
        variant="outline"
        className={cn(STATUS_STYLES.escalated)}
      >
        <ArrowUpIcon data-icon="inline-start" />
        Escalated
      </Button>
    );
  }

  // ✅ UNRESOLVED — red / right arrow
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      size="sm"
      variant="outline"
      className={cn(STATUS_STYLES.unresolved)}
    >
      <ArrowRightIcon data-icon="inline-start" />
      Unresolved
    </Button>
  );
};
