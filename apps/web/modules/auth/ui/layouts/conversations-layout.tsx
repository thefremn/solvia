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
          <div className="h-full bg-white">
            <ConversationsPanel onCollapseList={() => setListCollapsed(true)} />
          </div>
        </ResizablePanel>
      )}
      {listCollapsed && (
        <div className="flex w-10 shrink-0 flex-col items-center border-r border-[#E2E8F0] bg-white py-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setListCollapsed(false)}
            aria-label="Expand conversation list"
            className="text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F2D52]"
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
