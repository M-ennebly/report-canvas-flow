
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Document } from "@/types";
import UploadDropzone from "@/components/upload/UploadDropzone";
import DocumentsList from "@/components/upload/DocumentsList";

interface BulkUploadTabProps {
  selectedFiles: FileList | null;
  uploadedDocuments: Document[];
  isLoading: boolean;
  onFilesSelected: (files: FileList) => void;
  onRemoveDocument: (docId: string) => void;
  onProcess: () => void;
}

const BulkUploadTab: React.FC<BulkUploadTabProps> = ({
  selectedFiles,
  uploadedDocuments,
  isLoading,
  onFilesSelected,
  onRemoveDocument,
  onProcess,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-800">Upload Multiple Documents</h2>
      <p className="text-slate-600">
        Upload documents and extract figures across all workflow stages
      </p>
      
      <UploadDropzone 
        onFilesSelected={onFilesSelected}
        selectedFiles={selectedFiles}
      />
      
      <DocumentsList 
        documents={uploadedDocuments} 
        onRemoveDocument={onRemoveDocument} 
      />
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={onProcess}
          disabled={uploadedDocuments.length === 0 || isLoading}
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Go to Workspace"
          )}
        </Button>
      </div>
    </div>
  );
};

export default BulkUploadTab;
