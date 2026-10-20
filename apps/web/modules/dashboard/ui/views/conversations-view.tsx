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
    <div className="flex h-full flex-1 flex-col bg-[#F8FAFC] p-4 sm:p-6">
      <div className="flex min-h-0 flex-1 flex-col">
        <Empty className="border border-dashed border-[#E2E8F0] bg-white">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-[#F1F5F9] text-[#475569]">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle className="text-[#0F172A]">
              Select a conversation
            </EmptyTitle>
            <EmptyDescription className="text-[#475569]">
              Choose a conversation from the list to view messages and reply in
              real time.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </div>
  );
};
