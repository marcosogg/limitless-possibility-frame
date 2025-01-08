import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FileUploadZoneProps {
  isProcessing: boolean;
  onFileSelect: (file: File) => void;
  existingFiles: string[];
}

export const FileUploadZone = ({ 
  isProcessing, 
  onFileSelect,
  existingFiles 
}: FileUploadZoneProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileProceed = (file: File) => {
    if (existingFiles.includes(file.name)) {
      setPendingFile(file);
      setShowConfirmDialog(true);
    } else {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]?.type === "text/csv") {
      handleFileProceed(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === "text/csv") {
      handleFileProceed(file);
    }
  };

  const handleConfirmUpload = () => {
    if (pendingFile) {
      onFileSelect(pendingFile);
      setPendingFile(null);
    }
    setShowConfirmDialog(false);
  };

  const handleCancelUpload = () => {
    setPendingFile(null);
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? "border-primary bg-primary/5" : "border-gray-300"
        } transition-colors mb-8`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="h-12 w-12 text-gray-400" />
          </div>
          <div className="space-y-2">
            <p className="text-lg">
              Drag and drop your Revolut statement here, or
            </p>
            <div>
              <label htmlFor="file-upload">
                <Button
                  disabled={isProcessing}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  {isProcessing ? "Processing..." : "Upload Revolut Statement"}
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
            </div>
            <p className="text-sm text-gray-500">Only CSV files are supported</p>
          </div>
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>File Already Exists</AlertDialogTitle>
            <AlertDialogDescription>
              A file named "{pendingFile?.name}" has already been imported. Do you want to proceed and potentially create duplicate entries?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelUpload}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpload}>
              Continue Import
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};