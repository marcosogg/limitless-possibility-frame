import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export default function Import() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid CSV file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Here you would implement the actual file processing logic
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Statement imported successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Error importing statement:", error);
      toast({
        title: "Error",
        description: "Failed to import statement",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8">
      <div className="max-w-[600px] mx-auto space-y-4">
        <Card className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
          <CardHeader className="p-4">
            <CardTitle className="text-[17px] font-semibold text-[#1C1E21]">Import Revolut Statement</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="bg-[#F0F2F5] rounded-lg p-4 text-[13px] text-[#65676B]">
              <p>To import your Revolut statement:</p>
              <ol className="list-decimal ml-4 mt-2 space-y-1">
                <li>Export your statement from Revolut in CSV format</li>
                <li>Select the exported file using the button below</li>
                <li>Click "Import Statement" to process the file</li>
              </ol>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-[#E4E6EB] rounded-lg">
              <Upload className="h-8 w-8 text-[#65676B]" />
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="max-w-[250px]"
              />
              {file && (
                <p className="text-[13px] text-[#1C1E21]">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="text-[#1C1E21] hover:bg-[#F2F3F5]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="bg-[#1877F2] hover:brightness-95 text-white"
              >
                {isUploading ? "Importing..." : "Import Statement"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 