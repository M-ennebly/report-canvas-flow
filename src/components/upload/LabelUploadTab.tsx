
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Document } from "@/types";
import UploadDropzone from "@/components/upload/UploadDropzone";
import DocumentsList from "@/components/upload/DocumentsList";

interface LabelUploadLabel {
  id: string;
  name: string;
  color: string;
}

interface LabelUploadTabProps {
  labels: LabelUploadLabel[];
  selectedFiles: FileList | null;
  selectedLabels: string[];
  uploadedDocuments: Document[];
  isLoading: boolean;
  onLabelUpload: (files: FileList, labelId: string) => void;
  onRemoveDocument: (docId: string) => void;
  onProcess: () => void;
}

const LabelUploadTab: React.FC<LabelUploadTabProps> = ({
  labels,
  selectedFiles,
  selectedLabels,
  uploadedDocuments,
  isLoading,
  onLabelUpload,
  onRemoveDocument,
  onProcess,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-800">Upload to Specific Workflow Stages</h2>
      <p className="text-slate-600">
        Select specific workflow stages and upload documents directly to those stages
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {labels.map((label) => (
          <div key={label.id} className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 ${label.color} rounded-full`}></div>
              <h3 className="font-medium">{label.name}</h3>
            </div>
            <UploadDropzone
              onFilesSelected={(files) => onLabelUpload(files, label.id)}
              selectedFiles={selectedLabels.includes(label.id) ? selectedFiles : null}
              height="small"
            />
          </div>
        ))}
      </div>
      
      <DocumentsList 
        documents={uploadedDocuments} 
        onRemoveDocument={onRemoveDocument} 
      />
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={onProcess}
          disabled={!selectedFiles || selectedLabels.length === 0 || isLoading}
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Process and Extract Figures"
          )}
        </Button>
      </div>
    </div>
  );
};

export default LabelUploadTab;
