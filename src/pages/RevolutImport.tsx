import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export default function RevolutImport() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]?.type === "text/csv") {
      await processFile(files[0]);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === "text/csv") {
      await processFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      // TODO: Implement file processing logic
      toast({
        title: "File uploaded",
        description: "Your Revolut statement is being processed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Import Revolut Statement</h1>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? "border-primary bg-primary/5" : "border-gray-300"
        } transition-colors`}
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
    </div>
  );
}