
import React from "react";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UploadDropzoneProps {
  onFilesSelected: (files: FileList) => void;
  selectedFiles: FileList | null;
  height?: "normal" | "small";
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFilesSelected,
  selectedFiles,
  height = "normal"
}) => {
  const { toast } = useToast();
  const acceptedFileTypes = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png";
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Check if files are too large (limit to 10MB per file)
      const oversizedFiles = Array.from(e.target.files).filter(file => file.size > 10 * 1024 * 1024);
      
      if (oversizedFiles.length > 0) {
        toast({
          title: "File size exceeded",
          description: `${oversizedFiles.length} file(s) exceed the 10MB limit and were not uploaded`,
          variant: "destructive"
        });
        
        // Filter out oversized files
        const validFiles = Array.from(e.target.files)
          .filter(file => file.size <= 10 * 1024 * 1024);
        
        // Only proceed if there are valid files
        if (validFiles.length > 0) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach(file => dataTransfer.items.add(file));
          onFilesSelected(dataTransfer.files);
        }
      } else {
        onFilesSelected(e.target.files);
      }
      
      e.target.value = ""; // Reset input so the same files can be selected again
    }
  };

  // Helper function to get file type display name
  const getFileTypeDescription = () => {
    return height === "normal" 
      ? "Upload documents, images, and more" 
      : "PDF, DOC, JPG, PNG, etc.";
  };

  return (
    <div>
      <div 
        className={`border-2 border-dashed border-slate-200 rounded-lg text-center space-y-2 ${
          height === "normal" ? "p-8" : "p-4"
        }`}
      >
        <FileUp className={`mx-auto ${height === "normal" ? "h-12 w-12" : "h-8 w-8"} text-slate-400`} />
        <p className="text-slate-500">{getFileTypeDescription()}</p>
        {height === "normal" && (
          <p className="text-xs text-slate-500">PDF, DOC, PPT, XLS, JPG, PNG (Max 10MB)</p>
        )}
        <label>
          <input
            type="file"
            accept={acceptedFileTypes}
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            type="button"
            variant="outline"
            className={`mt-2 ${height === "normal" ? "w-full max-w-md mx-auto" : "w-full"}`}
            asChild
          >
            <span>Select Files</span>
          </Button>
        </label>
      </div>
      
      {selectedFiles && selectedFiles.length > 0 && (
        <div className={`mt-3 text-sm text-left ${height === "normal" ? "max-w-md mx-auto" : ""}`}>
          <p className="font-medium mb-1">{selectedFiles.length} file(s) selected</p>
          <ul className={`list-disc pl-5 ${height === "normal" ? "" : "text-xs max-h-20 overflow-y-auto"}`}>
            {Array.from(selectedFiles).slice(0, height === "normal" ? undefined : 3).map((file, index) => (
              <li key={index} className="truncate">{file.name}</li>
            ))}
            {height === "small" && selectedFiles.length > 3 && (
              <li className="text-slate-500">+{selectedFiles.length - 3} more</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadDropzone;
