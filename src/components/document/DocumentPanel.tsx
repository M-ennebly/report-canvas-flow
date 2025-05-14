import React, { useState } from "react";
import { Document, Project } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, FileImage, Trash2, ChevronDown, ChevronUp, FileText, PenLine, Link, FolderOpen } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  
  // Document type icons and colors
  const getDocumentTypeIcon = (type: string) => {
    switch(type) {
      case "pdf":
        return <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">PDF</div>;
      default:
        return <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center">FILE</div>;
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
      <div className="p-4 border-b bg-slate-50">
        <h2 className="text-lg font-semibold flex items-center">
          <FolderOpen className="mr-2 h-5 w-5 text-blue-500" />
          Project Details
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Document Uploader Section */}
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <FileText className="mr-2 h-4 w-4 text-slate-500" />
            Documents
          </h3>
          
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
          
          {project.documents.length > 0 && (
            <div className="mt-6 space-y-3 max-h-48 overflow-y-auto">
              <h4 className="text-xs uppercase font-medium text-slate-500 flex items-center">
                <FileText className="mr-1 h-3 w-3" />
                Uploaded files
                <Badge variant="secondary" className="ml-2 font-normal">
                  {project.documents.length}
                </Badge>
              </h4>
              <div className="space-y-2 pr-1">
                {project.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 text-sm rounded-md hover:bg-slate-50 border border-slate-100 bg-white transition-colors"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      {getDocumentTypeIcon(doc.type)}
                      <div className="ml-3 overflow-hidden">
                        <p className="truncate font-medium text-slate-700">{doc.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date().toLocaleDateString()} • {Math.round(Math.random() * 10) + 1} pages
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      {onExtractFigures && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onExtractFigures(doc.id)}
                          className="text-slate-500 hover:text-blue-500 flex-shrink-0 hover:bg-blue-50"
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
                          className="text-slate-500 hover:text-red-500 flex-shrink-0 hover:bg-red-50"
                          title="Delete document"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
              <Textarea
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Describe your project here..."
                className="resize-none h-32 border-slate-200 focus-visible:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-2">
                This description will be used in the report overview section.
              </p>
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
              <Select
                value={project.linkedReportId || "none"}
                onValueChange={onLinkedReportChange}
              >
                <SelectTrigger className="border-slate-200 focus:ring-blue-500">
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
              <p className="text-xs text-slate-500 mt-2">
                Connect this project to an existing report for easier reference.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default DocumentPanel;
