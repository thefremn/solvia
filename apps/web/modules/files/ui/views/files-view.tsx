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
    className: "border-transparent bg-green-100 font-semibold text-green-700",
  },
  processing: {
    label: "Indexing",
    icon: Loader2Icon,
    className: "border-transparent bg-amber-100 font-semibold text-amber-700",
  },
  error: {
    label: "Failed",
    icon: CircleXIcon,
    className: "border-transparent bg-red-100 font-semibold text-red-600",
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

      <div className="flex min-h-screen flex-col bg-[#F8FAFC] p-4 sm:p-6">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl leading-tight font-bold text-[#0F172A]">
                Knowledge Base
              </h1>
              <p className="text-sm text-[#475569]">
                Upload and manage documents for your AI assistant
              </p>
            </div>
            {!isLoadingFirstPage && (
              <p className="shrink-0 text-xs text-[#475569] tabular-nums">
                <span className="font-semibold text-[#0F172A]">
                  {indexedCount}
                </span>{" "}
                indexed
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={openUploadDialog}
            className="flex w-full cursor-pointer items-center gap-4 rounded-xl border border-dashed border-[#E2E8F0] bg-white p-4 text-left shadow-xs transition-colors duration-150 ease-out hover:border-[#0F2D52] sm:p-5"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F9]">
              <UploadIcon className="size-5 text-[#127CDD]" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-sm text-[#0F172A]">
                <span className="font-semibold">Click to upload</span>
                <span className="text-[#475569]">
                  {" "}
                  a document to your knowledge base
                </span>
              </span>
              <span className="truncate text-xs text-[#475569]">
                PDF, TXT or CSV · The assistant indexes new documents
                automatically
              </span>
            </span>
            <span className="hidden shrink-0 rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-semibold text-[#0F2D52] sm:block">
              Browse files
            </span>
          </button>

          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-[#475569] uppercase tabular-nums">
              Documents · {files.results.length}
            </p>
            <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E2E8F0] bg-[#F1F5F9] hover:bg-[#F1F5F9]">
                    <TableHead className="px-3 py-3 text-xs font-semibold tracking-wide text-[#475569] uppercase">
                      Document
                    </TableHead>
                    <TableHead className="hidden px-3 py-3 text-xs font-semibold tracking-wide text-[#475569] uppercase sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden px-3 py-3 text-xs font-semibold tracking-wide text-[#475569] uppercase md:table-cell">
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
                            <TableRow key={index} className="border-[#E2E8F0]">
                              <TableCell className="px-3 py-3">
                                <div className="flex items-center gap-3">
                                  <Skeleton className="size-10 shrink-0 rounded-lg bg-[#F1F5F9]" />
                                  <div className="flex flex-1 flex-col gap-1.5">
                                    <Skeleton className="h-4 w-40 bg-[#F1F5F9]" />
                                    <Skeleton className="h-3 w-12 bg-[#F1F5F9]" />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden px-3 py-3 sm:table-cell">
                                <Skeleton className="h-6 w-20 rounded-full bg-[#F1F5F9]" />
                              </TableCell>
                              <TableCell className="hidden px-3 py-3 md:table-cell">
                                <Skeleton className="h-4 w-14 bg-[#F1F5F9]" />
                              </TableCell>
                              <TableCell className="px-3 py-3" />
                            </TableRow>
                          ))}
                        </>
                      );
                    }

                    if (files.results.length === 0) {
                      return (
                        <TableRow className="border-[#E2E8F0] hover:bg-transparent">
                          <TableCell
                            className="h-32 px-3 py-3 text-center text-sm text-[#475569]"
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
                          className="border-[#E2E8F0] hover:bg-[#F1F5F9]"
                          key={file.id}
                        >
                          <TableCell className="px-3 py-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F9]">
                                <FileIcon className="size-5 text-[#475569]" />
                              </span>
                              <span className="flex min-w-0 flex-col">
                                <span className="truncate text-sm font-semibold text-[#0F172A]">
                                  {file.name}
                                </span>
                                <span className="text-[11px] tracking-wide text-[#475569] uppercase">
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
                          <TableCell className="hidden px-3 py-3 text-sm text-[#475569] tabular-nums md:table-cell">
                            {file.size}
                          </TableCell>
                          <TableCell className="px-3 py-3">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDeleteClick(file)}
                              aria-label={`Delete ${file.name}`}
                              title={`Delete ${file.name}`}
                              className="text-[#475569] hover:bg-red-100 hover:text-red-600"
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
                <div className="border-t border-[#E2E8F0]">
                  <InfiniteScrollTrigger
                    canLoadMore={canLoadMore}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={handleLoadMore}
                    ref={topElementRef}
                    className="text-[#475569] [&_button]:text-xs"
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
