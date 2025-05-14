
import React from "react";
import { Project } from "@/types";
import DocumentPanel from "@/components/document/DocumentPanel";

interface MobileDocumentPanelProps {
  isOpen: boolean;
  project: Project;
  onClose: () => void;
  onDescriptionChange: (description: string) => void;
  onLinkedReportChange: (reportId: string) => void;
  onDocumentUpload: (files: FileList) => void;
  onDocumentDelete: (documentId: string) => void;
}

const MobileDocumentPanel: React.FC<MobileDocumentPanelProps> = ({
  isOpen,
  project,
  onClose,
  onDescriptionChange,
  onLinkedReportChange,
  onDocumentUpload,
  onDocumentDelete
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="w-11/12 h-full bg-white overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <DocumentPanel
          project={project}
          onDescriptionChange={onDescriptionChange}
          onLinkedReportChange={onLinkedReportChange}
          onDocumentUpload={onDocumentUpload}
          onDocumentDelete={onDocumentDelete}
        />
      </div>
    </div>
  );
};

export default MobileDocumentPanel;
