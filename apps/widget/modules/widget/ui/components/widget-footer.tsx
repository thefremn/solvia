import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { HomeIcon, InboxIcon } from "lucide-react";
import { screenAtom } from "../../atoms/widget-atoms";

export const WidgetFooter = () => {
    const screen = useAtomValue(screenAtom);
    const setScreen = useSetAtom(screenAtom);

  return (
    <footer className="flex items-center justify-between border-t bg-background">
        <Button
            aria-current={screen === "selection" ? "page" : undefined}
            aria-label="Home"
            className="h-14 flex-1 flex-col gap-1 rounded-none"
            onClick={() => setScreen("selection")}
            variant="ghost"
        >
            <HomeIcon
            className={cn(screen === "selection" && "text-primary")}
            />
            <span className={cn("text-xs font-medium", screen === "selection" ? "text-primary" : "text-muted-foreground")}>
                Home
            </span>
        </Button>
        <Button
            aria-current={screen === "inbox" ? "page" : undefined}
            aria-label="Messages"
            className="h-14 flex-1 flex-col gap-1 rounded-none"
            onClick={() => setScreen("inbox")}
            variant="ghost"
        >
            <InboxIcon
            className={cn(screen === "inbox" && "text-primary")}
            />
            <span className={cn("text-xs font-medium", screen === "inbox" ? "text-primary" : "text-muted-foreground")}>
                Messages
            </span>
        </Button>
    </footer>
)
};
