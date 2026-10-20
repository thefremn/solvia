"use client";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import { InboxIcon } from "lucide-react";

export const ConversationsView = () => {
  return (
    <div className="flex h-full flex-1 flex-col bg-background p-4 sm:p-6">
      <div className="flex min-h-0 flex-1 flex-col">
        <Empty className="border border-dashed border-border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-muted text-muted-foreground">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle className="text-foreground">
              Select a conversation
            </EmptyTitle>
            <EmptyDescription className="text-muted-foreground">
              Choose a conversation from the list to view messages and reply in
              real time.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </div>
  );
};
