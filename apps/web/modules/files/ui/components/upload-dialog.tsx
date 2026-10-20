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
      <DialogContent className="border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Upload Document</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload documents to your Knowledgebase for AI-powered search and
            retrieval
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel
              htmlFor="category"
              className="text-sm font-semibold text-foreground"
            >
              Category
            </FieldLabel>
            <Input
              className="h-10 w-full border-border text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring"
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
              className="text-sm font-semibold text-foreground"
            >
              Filename{" "}
              <span className="text-xs font-normal text-muted-foreground">
                (optional)
              </span>
            </FieldLabel>
            <Input
              className="h-10 w-full border-border text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring"
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
            className="border-border bg-card text-foreground hover:bg-muted hover:text-primary"
          >
            Cancel
          </Button>

          <Button
            disabled={
              isUploading || uploadedFiles.length === 0 || !uploadForm.category
            }
            onClick={handleUpload}
            className="bg-primary text-sm font-semibold text-white hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
