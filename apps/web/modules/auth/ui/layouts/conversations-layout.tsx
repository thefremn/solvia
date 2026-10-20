"use client";

import { useState } from "react";
import { ChevronsRight } from "lucide-react";
import { ConversationsPanel } from "@/modules/dashboard/ui/components/conversations-panel";
import { Button } from "@workspace/ui/components/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";

export const ConversationsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [listCollapsed, setListCollapsed] = useState(false);

  return (
    <ResizablePanelGroup className="h-full flex-1" direction="horizontal">
      {!listCollapsed && (
        <ResizablePanel
          defaultSize={30}
          minSize={20}
          maxSize={30}
          className="md:min-w-[350px]"
        >
          <div className="h-full bg-card">
            <ConversationsPanel onCollapseList={() => setListCollapsed(true)} />
          </div>
        </ResizablePanel>
      )}
      {listCollapsed && (
        <div className="flex w-10 shrink-0 flex-col items-center border-r border-border bg-card py-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setListCollapsed(false)}
            aria-label="Expand conversation list"
            className="text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ChevronsRight />
          </Button>
        </div>
      )}
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70} className="h-full min-w-0">
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
