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
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import {
    Dropzone,
    DropzoneContent,
    DropzoneEmptyState
} from "@workspace/ui/components/dropzone";
import { api } from "@workspace/backend/_generated/api";

interface UploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFileUploaded?: () => void;
};

export const UploadDialog = ({
    open,
    onOpenChange,
    onFileUploaded,
}: UploadDialogProps) => {
    const addFile = useAction(api.private.files.addFile);

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const[isUploading, setIsUploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        category: "",
        filename: "",
    });

    const handleFileDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        if(file) {
            setUploadedFiles([file]);
            if(!uploadForm.filename) {
                setUploadForm((prev) => ({...prev, filename: file.name}));
            }
        }
    };

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Upload Document
                    </DialogTitle>
                    <DialogDescription>
                        Upload documents to your Knowledgebase for AI-powered search and retrieval
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="category">
                        Category
                    </Label>
                    <Input 
                        className="w-full"
                        id="category"
                        onChange={(e) => setUploadForm((prev) => ({
                            ...prev,
                            category: e.target.value,
                        }))}
                        placeholder="e.g., Documentation, Support, Product"
                        type="text"
                        value={uploadForm.category}
                    />
                </div>

                
            </DialogContent>
        </Dialog>
    )

  }