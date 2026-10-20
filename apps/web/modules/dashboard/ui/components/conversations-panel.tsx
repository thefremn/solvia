"use client";

import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { Button } from "@workspace/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import {
  ChevronsLeft,
  CornerUpLeftIcon,
  InboxIcon,
  Loader2Icon,
} from "lucide-react";
import { usePaginatedQuery, Authenticated, AuthLoading } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useAtomValue, useSetAtom } from "jotai/react";
import { statusFilterAtom } from "../../atoms";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { Skeleton } from "@workspace/ui/components/skeleton";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "unresolved", label: "Unresolved" },
  { value: "escalated", label: "Escalated" },
  { value: "resolved", label: "Resolved" },
] as const;

export const ConversationsPanel = ({
  onCollapseList,
}: {
  onCollapseList?: () => void;
}) => {
  return (
    <>
      <AuthLoading>
        <div className="flex h-full items-center justify-center">
          <Loader2Icon className="animate-spin text-[#94A3B8]" />
        </div>
      </AuthLoading>
      <Authenticated>
        <ConversationsPanelContent onCollapseList={onCollapseList} />
      </Authenticated>
    </>
  );
};

const ConversationsPanelContent = ({
  onCollapseList,
}: {
  onCollapseList?: () => void;
}) => {
  const pathname = usePathname();

  const statusFilter = useAtomValue(statusFilterAtom);
  const setStatusFilter = useSetAtom(statusFilterAtom);

  const conversations = usePaginatedQuery(
    api.private.conversations.getMany,
    {
      status: statusFilter === "all" ? undefined : statusFilter,
    },
    {
      initialNumItems: 10,
    },
  );
  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
    isLoadingFirstPage,
  } = useInfiniteScroll({
    status: conversations.status,
    loadMore: conversations.loadMore,
    loadSize: 10,
  });
  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] p-2">
        <ToggleGroup
          type="single"
          value={statusFilter}
          onValueChange={(value) => {
            if (value) {
              setStatusFilter(
                value as "all" | "unresolved" | "escalated" | "resolved",
              );
            }
          }}
          aria-label="Filter conversations by status"
          className="min-w-0 flex-1 justify-start gap-1 overflow-hidden rounded-lg bg-[#F1F5F9] p-1"
        >
          {STATUS_FILTERS.map((filter) => (
            <ToggleGroupItem
              key={filter.value}
              value={filter.value}
              aria-label={`Show ${filter.label} conversations`}
              className="h-8 shrink-0 rounded-full px-2 text-xs font-medium whitespace-nowrap text-[#475569] transition-colors duration-150 ease-out hover:bg-white hover:text-[#0F172A] data-[state=on]:bg-white! data-[state=on]:font-semibold! data-[state=on]:text-[#0F2D52]! data-[state=on]:shadow-xs!"
            >
              {filter.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onCollapseList}
          aria-label="Collapse conversation list"
          className="shrink-0 text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F2D52]"
        >
          <ChevronsLeft />
        </Button>
      </div>
      {isLoadingFirstPage ? (
        <SkeletonConversations />
      ) : conversations.results.length === 0 ? (
        <div className="flex min-h-0 flex-1 flex-col p-4">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <InboxIcon />
              </EmptyMedia>
              <EmptyTitle className="text-[#0F172A]">
                No conversations found
              </EmptyTitle>
              <EmptyDescription className="text-[#475569]">
                New conversations will appear here in real time.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex w-full flex-1 flex-col text-sm">
            {conversations.results.map((conversation) => {
              const isLastMessageFromOperator =
                conversation.lastMessage?.message?.role !== "user";

              const country = getCountryFromTimezone(
                conversation.contactSession.metadata?.timezone,
              );

              const countryFlagUrl = country?.code
                ? getCountryFlagUrl(country.code)
                : null;

              const isSelected =
                pathname === `/conversations/${conversation._id}`;

              return (
                <Link
                  key={conversation._id}
                  className={cn(
                    "relative flex cursor-pointer items-start gap-3 border-b border-[#E2E8F0] px-3 py-3 text-sm leading-tight transition-colors duration-150 ease-out hover:bg-[#F1F5F9]",
                    isSelected && "bg-[#EBF5FF] hover:bg-[#EBF5FF]",
                  )}
                  href={`/conversations/${conversation._id}`}
                >
                  <div
                    aria-hidden
                    className={cn(
                      "absolute top-0 left-0 h-full w-[3px] bg-[#127CDD] opacity-0 transition-opacity",
                      isSelected && "opacity-100",
                    )}
                  />
                  <DicebearAvatar
                    seed={conversation.contactSession._id}
                    badgeImageUrl={countryFlagUrl || undefined}
                    size={40}
                    className="shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex w-full items-center gap-2">
                      <span
                        className={cn(
                          "truncate text-sm font-semibold text-[#0F172A]",
                          isSelected && "text-[#0F2D52]",
                        )}
                      >
                        {conversation.contactSession.name}
                      </span>
                      <span className="ml-auto shrink-0 text-[11px] text-[#475569]">
                        {formatDistanceToNow(conversation._creationTime)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="flex w-0 grow items-center gap-1">
                        {isLastMessageFromOperator && (
                          <CornerUpLeftIcon className="size-3 shrink-0 text-[#475569]" />
                        )}
                        <span
                          className={cn(
                            "line-clamp-1 text-xs text-[#475569]",
                            !isLastMessageFromOperator &&
                              "font-semibold text-[#0F172A]",
                          )}
                        >
                          {conversation.lastMessage?.text}
                        </span>
                      </div>
                      <ConversationStatusIcon
                        status={conversation.status}
                        className="shrink-0"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
            <InfiniteScrollTrigger
              ref={topElementRef}
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              className="text-[#475569] [&_button]:text-xs"
            />
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export const SkeletonConversations = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
      <div className="relative flex w-full min-w-0 flex-col p-2">
        <div className="flex w-full flex-col gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="flex items-start gap-3 rounded-lg p-4" key={index}>
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <div className="flex w-full items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="ml-auto h-3 w-12 shrink-0" />
                </div>
                <div className="mt-2">
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
