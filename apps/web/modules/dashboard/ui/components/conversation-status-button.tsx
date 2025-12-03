import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { ArrowRightIcon, CheckIcon, ArrowUpIcon } from "lucide-react";

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
        variant="tertiary"
      >
        <CheckIcon className="mr-1 h-4 w-4" />
        Resolved
      </Button>
    );
  }

  // ✅ ESCALATED — yellow / UP ARROW
  if (status === "escalated") {
    return (
      <Button
        disabled={disabled}
        onClick={onClick}
        size="sm"
        className="bg-yellow-500/20 text-yellow-700 border border-yellow-500 hover:bg-yellow-500/30"
      >
        <ArrowUpIcon className="mr-1 h-4 w-4" />
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
      variant="destructive"
    >
      <ArrowRightIcon className="mr-1 h-4 w-4" />
      Unresolved
    </Button>
  );
};
