"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { PublicFile } from "@workspace/backend/private/files";
import { Button } from "@workspace/ui/components/button";
import {
  CheckIcon,
  CircleXIcon,
  FileIcon,
  Loader2Icon,
  TrashIcon,
  UploadIcon,
} from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { UploadDialog } from "../components/upload-dialog";
import { useState } from "react";
import { DeleteFileDialog } from "../components/delete-file.dialog";
import { cn } from "@workspace/ui/lib/utils";

const STATUS_CONFIG = {
  ready: {
    label: "Indexed",
    icon: CheckIcon,
    className: "border-transparent bg-green-100 font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-400",
  },
  processing: {
    label: "Indexing",
    icon: Loader2Icon,
    className: "border-transparent bg-amber-100 font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  error: {
    label: "Failed",
    icon: CircleXIcon,
    className: "border-transparent bg-red-100 font-semibold text-red-600 dark:bg-red-500/15 dark:text-red-400",
  },
} as const;

export const FilesView = () => {
  const files = usePaginatedQuery(
    api.private.files.list,
    {},
    {
      initialNumItems: 10,
    },
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingFirstPage,
    isLoadingMore,
  } = useInfiniteScroll({
    status: files.status,
    loadMore: files.loadMore,
    loadSize: 10,
  });

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null);
  const handleDeleteClick = (file: PublicFile) => {
    setSelectedFile(file);
    setDeleteDialogOpen(true);
  };
  const handleFileDeleted = () => {
    setSelectedFile(null);
  };

  const openUploadDialog = () => setUploadDialogOpen(true);
  const indexedCount = files.results.filter(
    (file) => file.status === "ready",
  ).length;

  return (
    <>
      <DeleteFileDialog
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
        file={selectedFile}
        onDeleted={handleFileDeleted}
      />
      <UploadDialog
        onOpenChange={setUploadDialogOpen}
        open={uploadDialogOpen}
      />

      <div className="flex min-h-screen flex-col bg-background p-4 sm:p-6">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl leading-tight font-bold text-foreground">
                Knowledge Base
              </h1>
              <p className="text-sm text-muted-foreground">
                Upload and manage documents for your AI assistant
              </p>
            </div>
            {!isLoadingFirstPage && (
              <p className="shrink-0 text-xs text-muted-foreground tabular-nums">
                <span className="font-semibold text-foreground">
                  {indexedCount}
                </span>{" "}
                indexed
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={openUploadDialog}
            className="flex w-full cursor-pointer items-center gap-4 rounded-xl border border-dashed border-border bg-card p-4 text-left shadow-xs transition-colors duration-150 ease-out hover:border-ring sm:p-5"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <UploadIcon className="size-5 text-brand-accent" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-sm text-foreground">
                <span className="font-semibold">Click to upload</span>
                <span className="text-muted-foreground">
                  {" "}
                  a document to your knowledge base
                </span>
              </span>
              <span className="truncate text-xs text-muted-foreground">
                PDF, TXT or CSV · The assistant indexes new documents
                automatically
              </span>
            </span>
            <span className="hidden shrink-0 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground sm:block">
              Browse files
            </span>
          </button>

          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase tabular-nums">
              Documents · {files.results.length}
            </p>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted hover:bg-muted">
                    <TableHead className="px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Document
                    </TableHead>
                    <TableHead className="hidden px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase md:table-cell">
                      Size
                    </TableHead>
                    <TableHead className="w-12 px-3 py-3">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    if (isLoadingFirstPage) {
                      return (
                        <>
                          {Array.from({ length: 3 }).map((_, index) => (
                            <TableRow key={index} className="border-border">
                              <TableCell className="px-3 py-3">
                                <div className="flex items-center gap-3">
                                  <Skeleton className="size-10 shrink-0 rounded-lg bg-muted" />
                                  <div className="flex flex-1 flex-col gap-1.5">
                                    <Skeleton className="h-4 w-40 bg-muted" />
                                    <Skeleton className="h-3 w-12 bg-muted" />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden px-3 py-3 sm:table-cell">
                                <Skeleton className="h-6 w-20 rounded-full bg-muted" />
                              </TableCell>
                              <TableCell className="hidden px-3 py-3 md:table-cell">
                                <Skeleton className="h-4 w-14 bg-muted" />
                              </TableCell>
                              <TableCell className="px-3 py-3" />
                            </TableRow>
                          ))}
                        </>
                      );
                    }

                    if (files.results.length === 0) {
                      return (
                        <TableRow className="border-border hover:bg-transparent">
                          <TableCell
                            className="h-32 px-3 py-3 text-center text-sm text-muted-foreground"
                            colSpan={4}
                          >
                            No documents yet. Upload your first document to get
                            started.
                          </TableCell>
                        </TableRow>
                      );
                    }

                    return files.results.map((file) => {
                      const status = STATUS_CONFIG[file.status];
                      const StatusIcon = status.icon;
                      return (
                        <TableRow
                          className="border-border hover:bg-muted"
                          key={file.id}
                        >
                          <TableCell className="px-3 py-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <FileIcon className="size-5 text-muted-foreground" />
                              </span>
                              <span className="flex min-w-0 flex-col">
                                <span className="truncate text-sm font-semibold text-foreground">
                                  {file.name}
                                </span>
                                <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                                  {file.type}
                                </span>
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden px-3 py-3 sm:table-cell">
                            <Badge className={cn(status.className)}>
                              <StatusIcon
                                className={cn(
                                  file.status === "processing" &&
                                    "animate-spin motion-reduce:animate-none",
                                )}
                              />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden px-3 py-3 text-sm text-muted-foreground tabular-nums md:table-cell">
                            {file.size}
                          </TableCell>
                          <TableCell className="px-3 py-3">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDeleteClick(file)}
                              aria-label={`Delete ${file.name}`}
                              title={`Delete ${file.name}`}
                              className="text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/15"
                            >
                              <TrashIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    });
                  })()}
                </TableBody>
              </Table>
              {!isLoadingFirstPage && (
                <div className="border-t border-border">
                  <InfiniteScrollTrigger
                    canLoadMore={canLoadMore}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={handleLoadMore}
                    ref={topElementRef}
                    className="text-muted-foreground [&_button]:text-xs"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
