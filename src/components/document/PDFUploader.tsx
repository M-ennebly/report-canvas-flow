
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PDFUploaderProps {
  onDocumentUpload: (files: FileList) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onDocumentUpload }) => {
  const { toast } = useToast();
  const acceptedFileTypes = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png";
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Check if files are too large (limit to 10MB per file)
      const oversizedFiles = Array.from(e.target.files).filter(file => file.size > 10 * 1024 * 1024);
      
      if (oversizedFiles.length > 0) {
        toast({
          title: "File size exceeded",
          description: "Some files exceed the 10MB limit and were not uploaded",
          variant: "destructive"
        });
        
        // Filter out oversized files
        const validFiles = Array.from(e.target.files)
          .filter(file => file.size <= 10 * 1024 * 1024);
        
        // Only proceed if there are valid files
        if (validFiles.length > 0) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach(file => dataTransfer.items.add(file));
          onDocumentUpload(dataTransfer.files);
        }
      } else {
        onDocumentUpload(e.target.files);
      }
      
      e.target.value = ""; // Reset input
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200">
      <div className="bg-blue-50 p-3 inline-flex rounded-full">
        <FileUp className="h-6 w-6 text-blue-500" />
      </div>
      <p className="text-sm text-slate-600">Upload documents, images, and more</p>
      <p className="text-xs text-slate-500">PDF, DOC, PPT, XLS, JPG, PNG (Max 10MB)</p>
      <label>
        <Input 
          type="file"
          accept={acceptedFileTypes}
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
