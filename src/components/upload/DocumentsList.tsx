
import React, { useState } from "react";
import { Document } from "@/types";
import { Button } from "@/components/ui/button";
import { FileImage, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ui/confirm-dialog";

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
  
  if (documents.length === 0) return null;
  
  // Colors for labels
  const labelColors: Record<string, string> = {
    design: "bg-kanban-design text-white",
    analyse: "bg-kanban-analyse text-white",
    dev: "bg-kanban-dev text-white",
    testing: "bg-kanban-testing text-white",
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
  
  return (
    <div className="mt-6 border rounded-md p-4 bg-white">
      <h3 className="font-medium mb-2">Selected Documents:</h3>
      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {documents.map(doc => (
          <li key={doc.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
            <div className="flex items-center flex-1 min-w-0">
              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center mr-2 text-xs">
                {doc.type.toUpperCase()}
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
            <div className="flex items-center space-x-1">
              {onExtractFigures && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-slate-700 flex-shrink-0"
                  onClick={() => onExtractFigures(doc.id)}
                >
                  <FileImage className="h-4 w-4 mr-1" /> Extract Figures
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-500 hover:text-red-500 flex-shrink-0"
                onClick={() => handleDeleteClick(doc.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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
    </div>
  );
};

export default DocumentsList;
