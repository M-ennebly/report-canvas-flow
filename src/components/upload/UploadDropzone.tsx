
import React from "react";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      e.target.value = ""; // Reset input so the same files can be selected again
    }
  };

  return (
    <div>
      <div 
        className={`border-2 border-dashed border-slate-200 rounded-lg text-center space-y-2 ${
          height === "normal" ? "p-8" : "p-4"
        }`}
      >
        <FileUp className={`mx-auto ${height === "normal" ? "h-12 w-12" : "h-8 w-8"} text-slate-400`} />
        <p className="text-slate-500">Upload PDF files only</p>
        <label>
          <input
            type="file"
            accept=".pdf"
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
