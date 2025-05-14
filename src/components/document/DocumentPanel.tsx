
import React, { useState } from "react";
import { Project } from "@/types";
import { FolderOpen, FileText, PenLine, Link, ChevronLeft, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import PDFUploader from "./PDFUploader";
import DocumentList from "./DocumentList";
import ProjectDescription from "./ProjectDescription";
import LinkedReportSelector from "./LinkedReportSelector";

interface DocumentPanelProps {
  project: Project;
  onDescriptionChange: (description: string) => void;
  onLinkedReportChange: (reportId: string) => void;
  onDocumentUpload: (files: FileList) => void;
  onDocumentDelete?: (documentId: string) => void;
  onExtractFigures?: (documentId: string) => void;
}

const DocumentPanel: React.FC<DocumentPanelProps> = ({
  project,
  onDescriptionChange,
  onLinkedReportChange,
  onDocumentUpload,
  onDocumentDelete,
  onExtractFigures
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="h-full flex flex-col">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex h-full">
        <div className={`flex-1 flex flex-col overflow-hidden bg-white ${isOpen ? 'border-r' : ''}`}>
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center">
              <FolderOpen className="mr-2 h-5 w-5 text-blue-500" />
              Project Details
            </h2>
            <CollapsibleTrigger asChild>
              <button className="p-1 rounded-md hover:bg-slate-200">
                <ChevronLeft className="h-5 w-5" />
              </button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="flex-1 overflow-y-auto flex flex-col">
            {/* Document Uploader Section */}
            <div className="p-4 border-b">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <FileText className="mr-2 h-4 w-4 text-slate-500" />
                Documents
              </h3>
              
              <PDFUploader onDocumentUpload={onDocumentUpload} />
              
              {project.documents.length > 0 && (
                <DocumentList 
                  documents={project.documents}
                  onDocumentDelete={onDocumentDelete}
                  onExtractFigures={onExtractFigures}
                />
              )}
            </div>
            
            {/* Collapsible sections using Accordion */}
            <Accordion type="single" collapsible className="w-full" defaultValue="description">
              {/* Project Description Section */}
              <AccordionItem value="description" className="border-b">
                <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:bg-slate-50">
                  <span className="flex items-center text-slate-700">
                    <PenLine className="mr-2 h-4 w-4 text-blue-500" />
                    Project Description
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-1">
                  <ProjectDescription 
                    initialDescription={project.description} 
                    onDescriptionChange={onDescriptionChange} 
                  />
                </AccordionContent>
              </AccordionItem>
              
              {/* Linked Report Section */}
              <AccordionItem value="linkedReport">
                <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:bg-slate-50">
                  <span className="flex items-center text-slate-700">
                    <Link className="mr-2 h-4 w-4 text-green-500" />
                    Linked Report
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-1">
                  <LinkedReportSelector 
                    linkedReportId={project.linkedReportId} 
                    onLinkedReportChange={onLinkedReportChange} 
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CollapsibleContent>
        </div>
        
        {/* Collapsed state button */}
        {!isOpen && (
          <button 
            className="h-full w-10 border-r flex items-center justify-center hover:bg-slate-100"
            onClick={() => setIsOpen(true)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </Collapsible>
    </div>
  );
};

export default DocumentPanel;
