"use client";

import { useMutation } from "convex/react";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { api } from "@workspace/backend/_generated/api";
import { PublicFile } from "@workspace/backend/private/files";

interface DeleteFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: PublicFile | null;
  onDeleted?: () => void;
}

export const DeleteFileDialog = ({
  open,
  onOpenChange,
  file,
  onDeleted,
}: DeleteFileDialogProps) => {
  const deleteFile = useMutation(api.private.files.deleteFile);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!file) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteFile({ entryId: file.id });
      onDeleted?.();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#E2E8F0] bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#0F172A]">Delete File</DialogTitle>
          <DialogDescription className="text-[#475569]">
            Are you sure you want to delete this file?This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        {file && (
          <div className="py-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-4">
              <p className="text-sm font-semibold text-[#0F172A]">
                {file.name}
              </p>
              <p className="text-sm text-[#475569]">
                Type:{file.type.toUpperCase()} | Size: {file.size}
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            disabled={isDeleting}
            variant="outline"
            className="border-[#E2E8F0] bg-white text-[#0F2D52] hover:bg-[#F1F5F9] hover:text-[#0A2240]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={isDeleting || !file}
            variant="destructive"
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
