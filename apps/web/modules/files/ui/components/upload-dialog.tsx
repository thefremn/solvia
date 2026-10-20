"use client";

import { useAction } from "convex/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field";
import { Button } from "@workspace/ui/components/button";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@workspace/ui/components/dropzone";
import { api } from "@workspace/backend/_generated/api";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploaded?: () => void;
}

export const UploadDialog = ({
  open,
  onOpenChange,
  onFileUploaded,
}: UploadDialogProps) => {
  const addFile = useAction(api.private.files.addFile);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    category: "",
    filename: "",
  });

  const handleFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file) {
      setUploadedFiles([file]);
      if (!uploadForm.filename) {
        setUploadForm((prev) => ({ ...prev, filename: file.name }));
      }
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const blob = uploadedFiles[0];

      if (!blob) {
        return;
      }

      const filename = uploadForm.filename || blob.name;

      await addFile({
        bytes: await blob.arrayBuffer(),
        filename,
        mimeType: blob.type || "text/plain",
        category: uploadForm.category,
      });
      onFileUploaded?.();
      handleCancel();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setUploadedFiles([]);
    setUploadForm({ category: "", filename: "" });
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="border-[#E2E8F0] bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#0F172A]">Upload Document</DialogTitle>
          <DialogDescription className="text-[#475569]">
            Upload documents to your Knowledgebase for AI-powered search and
            retrieval
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel
              htmlFor="category"
              className="text-sm font-semibold text-[#0F172A]"
            >
              Category
            </FieldLabel>
            <Input
              className="h-10 w-full border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#475569] focus-visible:border-[#0F2D52]"
              id="category"
              onChange={(e) =>
                setUploadForm((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              placeholder="e.g., Documentation, Support, Product"
              type="text"
              value={uploadForm.category}
            />
          </Field>
          <Field>
            <FieldLabel
              htmlFor="filename"
              className="text-sm font-semibold text-[#0F172A]"
            >
              Filename{" "}
              <span className="text-xs font-normal text-[#475569]">
                (optional)
              </span>
            </FieldLabel>
            <Input
              className="h-10 w-full border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#475569] focus-visible:border-[#0F2D52]"
              id="filename"
              onChange={(e) =>
                setUploadForm((prev) => ({
                  ...prev,
                  filename: e.target.value,
                }))
              }
              placeholder="Override default filename"
              type="text"
              value={uploadForm.filename}
            />
          </Field>
          <Dropzone
            accept={{
              "application/pdf": [".pdf"],
              "text/plain": [".txt"],
              "text/csv": [".csv"],
            }}
            disabled={isUploading}
            maxFiles={1}
            onDrop={handleFileDrop}
            src={uploadedFiles}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </FieldGroup>
        <DialogFooter>
          <Button
            disabled={isUploading}
            onClick={handleCancel}
            variant="outline"
            className="border-[#E2E8F0] bg-white text-[#0F2D52] hover:bg-[#F1F5F9] hover:text-[#0A2240]"
          >
            Cancel
          </Button>

          <Button
            disabled={
              isUploading || uploadedFiles.length === 0 || !uploadForm.category
            }
            onClick={handleUpload}
            className="bg-[#0F2D52] text-sm font-semibold text-white hover:bg-[#0A2240] disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:opacity-100"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
