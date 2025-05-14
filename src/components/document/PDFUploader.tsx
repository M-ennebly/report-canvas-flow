
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp } from "lucide-react";

interface PDFUploaderProps {
  onDocumentUpload: (files: FileList) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onDocumentUpload }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onDocumentUpload(e.target.files);
      e.target.value = ""; // Reset input
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200">
      <div className="bg-blue-50 p-3 inline-flex rounded-full">
        <FileUp className="h-6 w-6 text-blue-500" />
      </div>
      <p className="text-sm text-slate-600">Upload PDF files only</p>
      <label>
        <Input 
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 w-full bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          asChild
        >
          <span className="flex items-center justify-center">
            <FileUp className="mr-1 h-4 w-4" />
            Select Files
          </span>
        </Button>
      </label>
    </div>
  );
};

export default PDFUploader;
