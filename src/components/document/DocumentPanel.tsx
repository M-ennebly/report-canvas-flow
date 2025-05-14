
import React, { useState } from "react";
import { Document, Project } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, FileImage, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

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
  const [description, setDescription] = useState(project.description || "");

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    onDescriptionChange(e.target.value);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onDocumentUpload(e.target.files);
      e.target.value = ""; // Reset input
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    if (onDocumentDelete) {
      onDocumentDelete(documentId);
    }
  };
  
  // For demo purposes only
  const availableReports = [
    { id: "report1", name: "Q1 2024 Market Analysis" },
    { id: "report2", name: "Product Strategy 2024" },
    { id: "report3", name: "Client Onboarding Review" },
  ];

  return (
    <div className="h-full bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Project Details</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Document Uploader Section */}
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium mb-3">Documents</h3>
          
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center space-y-2">
            <FileUp className="mx-auto h-6 w-6 text-slate-400" />
            <p className="text-sm text-slate-500">Upload PDF, DOCX or PPT files</p>
            <label>
              <Input 
                type="file"
                accept=".pdf,.docx,.doc,.ppt,.pptx"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                asChild
              >
                <span>Select Files</span>
              </Button>
            </label>
          </div>
          
          {project.documents.length > 0 && (
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
              <h4 className="text-xs uppercase font-medium text-slate-500">Uploaded files</h4>
              {project.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2 text-sm rounded-md hover:bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center mr-2">
                      {doc.type === "pdf" ? "PDF" : doc.type === "docx" ? "DOC" : "PPT"}
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate mr-2">{doc.name}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {onExtractFigures && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onExtractFigures(doc.id)}
                        className="text-slate-500 hover:text-blue-500 flex-shrink-0"
                        title="Extract figures"
                      >
                        <FileImage className="h-4 w-4" />
                      </Button>
                    )}
                    {onDocumentDelete && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-slate-500 hover:text-red-500 flex-shrink-0"
                        title="Delete document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Collapsible sections using Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {/* Project Description Section */}
          <AccordionItem value="description">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium">
              Project Description
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-0">
              <Textarea
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Describe your project here..."
                className="resize-none h-32"
              />
            </AccordionContent>
          </AccordionItem>
          
          {/* Linked Report Section */}
          <AccordionItem value="linkedReport">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium">
              Linked Report
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-0">
              <Select
                value={project.linkedReportId || "none"}
                onValueChange={onLinkedReportChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a report" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {availableReports.map((report) => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default DocumentPanel;
