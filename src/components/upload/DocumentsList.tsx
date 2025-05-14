
import React from "react";
import { Document } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DocumentsListProps {
  documents: Document[];
  onRemoveDocument: (docId: string) => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  onRemoveDocument,
}) => {
  if (documents.length === 0) return null;
  
  return (
    <div className="mt-6 border rounded-md p-4 bg-white">
      <h3 className="font-medium mb-2">Selected Documents:</h3>
      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {documents.map(doc => (
          <li key={doc.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center mr-2 text-xs">
                {doc.type.toUpperCase()}
              </div>
              <span className="truncate">{doc.name}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-500 hover:text-red-500"
              onClick={() => onRemoveDocument(doc.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentsList;
