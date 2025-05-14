
import React from "react";
import { Document } from "@/types";
import { Button } from "@/components/ui/button";
import { FileImage, Trash2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  if (documents.length === 0) return null;

  // Document type icons and colors
  const getDocumentTypeIcon = (type: string) => {
    switch(type) {
      case "pdf":
        return <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">PDF</div>;
      default:
        return <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center">FILE</div>;
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
                  onClick={() => onDocumentDelete(doc.id)}
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
  );
};

export default DocumentList;
