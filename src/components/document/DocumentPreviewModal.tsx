
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document } from "@/types";
import { toast } from "sonner";

// Import new componentized parts
import FilePreview from "./preview/FilePreview";
import CroppingToolbar from "./preview/CroppingToolbar";
import FiguresList from "./preview/FiguresList";
import DocumentPreviewHeader from "./preview/DocumentPreviewHeader";

interface CroppedFigure {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sourceDocumentId: string;
  label?: string;
}

interface DocumentPreviewModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveFigures?: (figures: CroppedFigure[]) => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  isOpen,
  onClose,
  onSaveFigures,
}) => {
  const [croppingMode, setCroppingMode] = useState(false);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null);
  const [croppedFigures, setCroppedFigures] = useState<CroppedFigure[]>([]);
  const [activeFigureId, setActiveFigureId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const isImage = document?.type.toLowerCase() === "image" || 
    ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(document?.type.toLowerCase() || "");

  const handleStartCrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!croppingMode || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCropStart({ x, y });
    setCropEnd({ x, y });
  };

  const handleCropMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!croppingMode || !cropStart || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
    
    setCropEnd({ x, y });
  };

  const handleEndCrop = () => {
    if (!croppingMode || !cropStart || !cropEnd || !document) return;
    
    // For a real implementation, we'd use canvas to crop the image
    // For this demo, we'll simulate it by capturing the coordinates
    const id = `figure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newFigure: CroppedFigure = {
      id,
      title: `Figure from ${document.name}`,
      description: "",
      imageUrl: document.url, // In a real app, this would be the cropped image URL
      sourceDocumentId: document.id,
      label: document.label // Inherit label from source document if available
    };

    setCroppedFigures([...croppedFigures, newFigure]);
    setActiveFigureId(id);
    
    // Reset crop state
    setCropStart(null);
    setCropEnd(null);
    setCroppingMode(false);
    
    toast.success("Area selected! Add details to your figure.");
  };

  const handleCancelCrop = () => {
    setCropStart(null);
    setCropEnd(null);
    setCroppingMode(false);
  };

  const handleFigureChange = (id: string, field: 'title' | 'description' | 'label', value: string) => {
    setCroppedFigures(
      croppedFigures.map((figure) =>
        figure.id === id ? { ...figure, [field]: value } : figure
      )
    );
  };

  const handleDeleteFigure = (id: string) => {
    setCroppedFigures(croppedFigures.filter((figure) => figure.id !== id));
    if (activeFigureId === id) {
      setActiveFigureId(null);
    }
  };

  const handleSave = () => {
    // Validate figures have titles
    const incompleteIndex = croppedFigures.findIndex(fig => !fig.title.trim());
    if (incompleteIndex >= 0) {
      toast.error("Please add a title to all figures");
      setActiveFigureId(croppedFigures[incompleteIndex].id);
      return;
    }

    if (onSaveFigures) {
      onSaveFigures(croppedFigures);
    }
    toast.success(`${croppedFigures.length} figures saved successfully`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[90%] max-h-[90vh] flex flex-col">
        <DocumentPreviewHeader documentName={document?.name} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden flex-1">
          {/* Preview Panel - takes 2/3 width on desktop */}
          <div className="md:col-span-2 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-slate-500">
                {document?.type.toUpperCase()}
              </div>
              
              <CroppingToolbar 
                isImage={!!isImage}
                croppingMode={croppingMode}
                isCropSelected={!!(cropStart && cropEnd)}
                onStartCropping={() => setCroppingMode(true)}
                onCancelCrop={handleCancelCrop}
                onCompleteCrop={handleEndCrop}
              />
            </div>
            <div className="flex-1 overflow-auto border rounded-md">
              <FilePreview 
                document={document}
                croppingMode={croppingMode}
                cropStart={cropStart}
                cropEnd={cropEnd}
                onMouseDown={handleStartCrop}
                onMouseMove={handleCropMove}
                onMouseUp={handleEndCrop}
                onMouseLeave={handleEndCrop}
              />
            </div>
          </div>
          
          {/* Figures Panel - takes 1/3 width on desktop */}
          <div className="border rounded-md p-4 flex flex-col h-[400px] md:h-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Extracted Figures</h3>
              {croppedFigures.length > 0 && (
                <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                  {croppedFigures.length} figure{croppedFigures.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            <FiguresList 
              figures={croppedFigures}
              activeFigureId={activeFigureId}
              onFigureChange={handleFigureChange}
              onDeleteFigure={handleDeleteFigure}
              onSelectFigure={setActiveFigureId}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={croppedFigures.length === 0}>
            Save Figures ({croppedFigures.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewModal;
