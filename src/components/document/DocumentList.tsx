
import React, { useState } from "react";
import { Document } from "@/types";
import { Button } from "@/components/ui/button";
import { FileImage, Trash2, FileText, Image, Files } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ui/confirm-dialog";

interface DocumentListProps {
  documents: Document[];
  onDocumentDelete?: (documentId: string) => void;
  onExtractFigures?: (documentId: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDocumentDelete,
  onExtractFigures
}) => {
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  if (documents.length === 0) return null;

  // Document type icons and colors
  const getDocumentTypeIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case "pdf":
        return <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">PDF</div>;
      case "word":
      case "doc":
      case "docx":
        return <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">DOC</div>;
      case "excel":
      case "xls":
      case "xlsx":
        return <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">XLS</div>;
      case "powerpoint":
      case "ppt":
      case "pptx":
        return <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">PPT</div>;
      case "image":
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Image className="h-4 w-4" />
        </div>;
      default:
        return <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Files className="h-4 w-4" />
        </div>;
    }
  };

  const handleDeleteClick = (documentId: string) => {
    setDocumentToDelete(documentId);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete && onDocumentDelete) {
      onDocumentDelete(documentToDelete);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="mt-6 space-y-3 max-h-48 overflow-y-auto">
      <h4 className="text-xs uppercase font-medium text-slate-500 flex items-center">
        <FileText className="mr-1 h-3 w-3" />
        Uploaded files
        <Badge variant="secondary" className="ml-2 font-normal">
          {documents.length}
        </Badge>
      </h4>
      <div className="space-y-2 pr-1">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 text-sm rounded-md hover:bg-slate-50 border border-slate-100 bg-white transition-colors"
          >
            <div className="flex items-center flex-1 min-w-0">
              {getDocumentTypeIcon(doc.type)}
              <div className="ml-3 overflow-hidden">
                <p className="truncate font-medium text-slate-700">{doc.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(doc.dateUploaded).toLocaleDateString()} • {doc.type.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex space-x-1 ml-2">
              {onExtractFigures && doc.type.toLowerCase() !== "image" && (
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
                  onClick={() => handleDeleteClick(doc.id)}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!documentToDelete}
        onClose={() => setDocumentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
      />
    </div>
  );
};

export default DocumentList;
