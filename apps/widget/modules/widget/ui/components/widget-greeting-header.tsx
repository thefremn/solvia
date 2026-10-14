import { MessagesSquareIcon } from "lucide-react";
import { WidgetHeader } from "./widget-header";

export const WidgetGreetingHeader = () => {
    return (
        <WidgetHeader>
            <div className="flex items-center gap-x-3 px-2">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15 text-primary-foreground">
                    <MessagesSquareIcon aria-hidden className="size-5" />
                </div>
                <div className="flex min-w-0 flex-col gap-y-1">
                    <h1 className="text-2xl font-bold leading-tight text-primary-foreground">
                        Hi there!
                    </h1>
                    <p className="text-sm font-normal leading-relaxed text-primary-foreground/80">
                        Let&apos;s get you started
                    </p>
                </div>
            </div>
        </WidgetHeader>
    );
}
