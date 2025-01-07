import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploadZoneProps {
  isProcessing: boolean;
  onFileSelect: (file: File) => void;
}

export const FileUploadZone = ({ isProcessing, onFileSelect }: FileUploadZoneProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]?.type === "text/csv") {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === "text/csv") {
      onFileSelect(file);
    }
  };

  return (
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
  );
};