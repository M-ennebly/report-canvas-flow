
import React, { useCallback } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document } from "@/types";

// Import componentized parts
import DocumentPreviewHeader from "./preview/DocumentPreviewHeader";
import PreviewPanel from "./preview/PreviewPanel";
import FiguresPanel from "./preview/FiguresPanel";
import { useDocumentPreview, CroppedFigure } from "@/hooks/document/useDocumentPreview";
import { toast } from "@/hooks/use-toast";

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
  // Safeguard to prevent hooks from running when document is null
  const documentId = document?.id || null;
  
  const {
    isImage,
    croppingMode,
    cropStart,
    cropEnd,
    croppedFigures,
    activeFigureId,
    imgRef,
    setCroppingMode,
    setActiveFigureId,
    handleStartCrop,
    handleCropMove,
    handleEndCrop,
    handleCancelCrop,
    handleFigureChange,
    handleDeleteFigure,
    handleSave
  } = useDocumentPreview(document, onSaveFigures);

  const handleSaveAndClose = useCallback(() => {
    // Check if figures exist
    if (croppedFigures.length === 0) {
      toast({
        title: "No figures to save",
        description: "Please select at least one area to save as a figure.",
        variant: "destructive"
      });
      return;
    }

    // Execute save logic and get the result (boolean)
    const saveSuccess = handleSave();
    
    // Only close the modal if save was successful
    if (saveSuccess) {
      onClose();
    }
  }, [croppedFigures, handleSave, onClose]);

  // If modal is not open, don't render anything to prevent hooks from running
  if (!isOpen || !document) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[95%] sm:w-[95%] max-h-[95vh] h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
        <div className="p-6 pb-2">
          <DocumentPreviewHeader documentName={document?.name} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 pt-2 overflow-hidden flex-1">
          {/* Preview Panel */}
          <PreviewPanel
            document={document}
            isImage={isImage}
            croppingMode={croppingMode}
            cropStart={cropStart}
            cropEnd={cropEnd}
            imgRef={imgRef}
            onStartCropping={() => setCroppingMode(true)}
            onCancelCrop={handleCancelCrop}
            onCompleteCrop={handleEndCrop}
            onMouseDown={handleStartCrop}
            onMouseMove={handleCropMove}
            onMouseUp={handleEndCrop}
            onMouseLeave={handleCancelCrop}
          />
          
          {/* Figures Panel */}
          <FiguresPanel
            figures={croppedFigures}
            activeFigureId={activeFigureId}
            onFigureChange={handleFigureChange}
            onDeleteFigure={handleDeleteFigure}
            onSelectFigure={setActiveFigureId}
          />
        </div>

        <DialogFooter className="p-6 pt-2 border-t bg-slate-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAndClose} 
            disabled={croppedFigures.length === 0}
          >
            Save Figures ({croppedFigures.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewModal;
