
import React, { useState } from "react";
import { Document } from "@/types";
import { Button } from "@/components/ui/button";
import { FileImage, Trash2, Image, Files, MoreHorizontal, Maximize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import DocumentPreviewModal from "@/components/document/DocumentPreviewModal";
import DocumentsGalleryModal from "@/components/document/DocumentsGalleryModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface DocumentsListProps {
  documents: Document[];
  onRemoveDocument: (docId: string) => void;
  onExtractFigures?: (docId: string) => void;
  showLabels?: boolean;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  onRemoveDocument,
  onExtractFigures,
  showLabels = false,
}) => {
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [documentToPreview, setDocumentToPreview] = useState<Document | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  
  if (documents.length === 0) return null;
  
  // Colors for labels
  const labelColors: Record<string, string> = {
    design: "bg-kanban-design text-white",
    analyse: "bg-kanban-analyse text-white",
    dev: "bg-kanban-dev text-white",
    testing: "bg-kanban-testing text-white",
  };
  
  // Get appropriate icon for document type
  const getDocumentIcon = (docType: string) => {
    const type = docType.toLowerCase();
    
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "image"].includes(type)) {
      return <Image className="h-4 w-4 text-purple-500" />;
    } else if (type === "pdf") {
      return <div className="text-xs text-red-500">PDF</div>;
    } else if (["doc", "docx", "word"].includes(type)) {
      return <div className="text-xs text-blue-500">DOC</div>;
    } else if (["ppt", "pptx", "powerpoint"].includes(type)) {
      return <div className="text-xs text-orange-500">PPT</div>;
    } else if (["xls", "xlsx", "excel"].includes(type)) {
      return <div className="text-xs text-green-500">XLS</div>;
    } else {
      return <Files className="h-4 w-4 text-slate-500" />;
    }
  };
  
  const handleDeleteClick = (docId: string) => {
    setDocumentToDelete(docId);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      onRemoveDocument(documentToDelete);
      setDocumentToDelete(null);
    }
  };
  
  const handleEditClick = (document: Document) => {
    setDocumentToPreview(document);
  };
  
  const handleSaveFigures = (figures: any[]) => {
    // In a real app, we would save these figures to the state or database
    if (figures.length > 0 && onExtractFigures && documentToPreview) {
      onExtractFigures(documentToPreview.id);
    }
  };
  
  return (
    <div className="mt-6 border rounded-md p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Selected Documents:</h3>
        <div className="flex items-center">
          <Badge variant="outline" className="mr-2">
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setGalleryOpen(true)}
          >
            <Maximize className="mr-1 h-3 w-3" />
            View All
          </Button>
        </div>
      </div>
      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {documents.map(doc => (
          <li key={doc.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
            <div className="flex items-center flex-1 min-w-0">
              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center mr-2">
                {getDocumentIcon(doc.type)}
              </div>
              <div className="flex items-center max-w-[70%]">
                <span className="truncate mr-2">{doc.name}</span>
                {showLabels && doc.label && (
                  <Badge variant="outline" className={`ml-1 ${labelColors[doc.label] || ""}`}>
                    {doc.label}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-500 hover:text-slate-700 flex-shrink-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    className="text-slate-600 cursor-pointer"
                    onClick={() => handleEditClick(doc)}
                  >
                    <FileImage className="mr-2 h-4 w-4" />
                    Edit Document
                  </DropdownMenuItem>
                  
                  {onExtractFigures && doc.type.toLowerCase() !== "image" && (
                    <DropdownMenuItem
                      className="text-slate-600 cursor-pointer"
                      onClick={() => onExtractFigures(doc.id)}
                    >
                      <FileImage className="mr-2 h-4 w-4" />
                      Extract Figures
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleDeleteClick(doc.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Document
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!documentToDelete}
        onClose={() => setDocumentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Document"
        description="Are you sure you want to remove this document from the selection? You can add it again later if needed."
      />
      
      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={documentToPreview}
        isOpen={!!documentToPreview}
        onClose={() => setDocumentToPreview(null)}
        onSaveFigures={handleSaveFigures}
      />
      
      {/* Documents Gallery Modal */}
      <DocumentsGalleryModal
        documents={documents}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onExtractFigures={onExtractFigures}
      />
    </div>
  );
};

export default DocumentsList;
