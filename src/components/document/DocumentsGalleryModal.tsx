
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Maximize, FileImage } from "lucide-react";
import DocumentPreviewModal from "./DocumentPreviewModal";
import { CroppedFigure } from "@/hooks/document/useDocumentPreview";

interface DocumentsGalleryModalProps {
  documents: Document[];
  isOpen: boolean;
  onClose: () => void;
  onExtractFigures?: (docId: string) => void;
}

const DocumentsGalleryModal: React.FC<DocumentsGalleryModalProps> = ({
  documents,
  isOpen,
  onClose,
  onExtractFigures,
}) => {
  const [documentToPreview, setDocumentToPreview] = useState<Document | null>(null);
  
  const handleSaveFigures = (figures: CroppedFigure[]) => {
    if (figures.length > 0 && onExtractFigures && documentToPreview) {
      onExtractFigures(documentToPreview.id);
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case "pdf":
        return <div className="w-6 h-6 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs">PDF</div>;
      case "word":
      case "doc":
      case "docx":
        return <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs">DOC</div>;
      case "excel":
      case "xls":
      case "xlsx":
        return <div className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xs">XLS</div>;
      case "powerpoint":
      case "ppt":
      case "pptx":
        return <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xs">PPT</div>;
      case "image":
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileImage className="h-5 w-5 text-purple-600" />;
      default:
        return <FileImage className="h-5 w-5 text-slate-600" />;
    }
  };

  const isImage = (type: string) => {
    return type.toLowerCase() === "image" || 
      ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(type.toLowerCase() || "");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-[80%] lg:max-w-[70%] max-h-[90vh] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl">Document Gallery</DialogTitle>
          </DialogHeader>
          
          <div className="p-6 pt-3 overflow-hidden flex-1">
            <ScrollArea className="h-full w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-40 bg-slate-50 flex items-center justify-center">
                      {isImage(doc.type) ? (
                        <img 
                          src={doc.url}
                          alt={doc.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-slate-100 rounded-lg flex items-center justify-center">
                          {getDocumentTypeIcon(doc.type)}
                        </div>
                      )}
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                        onClick={() => setDocumentToPreview(doc)}
                      >
                        <Maximize className="h-4 w-4" />
                        <span className="sr-only">Preview</span>
                      </Button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm truncate">{doc.name}</h3>
                      <p className="text-xs text-slate-500">
                        {doc.type.toUpperCase()} • {new Date(doc.dateUploaded).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <DialogFooter className="p-6 pt-2 border-t bg-slate-50">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={documentToPreview}
        isOpen={!!documentToPreview}
        onClose={() => setDocumentToPreview(null)}
        onSaveFigures={handleSaveFigures}
      />
    </>
  );
};

export default DocumentsGalleryModal;
