
import { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Document } from "@/types";
import { 
  CroppedFigure, 
  UseDocumentPreviewProps, 
  UseDocumentPreviewReturn 
} from "./types";
import { cropImage, isDocumentImage, createFigureFromCrop } from "./cropUtils";
import { useFigureUtils } from "./figureUtils";

export function useDocumentPreview(
  document: Document | null,
  onSaveFigures?: (figures: CroppedFigure[]) => void
): UseDocumentPreviewReturn {
  // State management
  const [croppingMode, setCroppingMode] = useState(false);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null);
  const [croppedFigures, setCroppedFigures] = useState<CroppedFigure[]>([]);
  const [activeFigureId, setActiveFigureId] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Reset state when document changes
  useEffect(() => {
    setCroppingMode(false);
    setCropStart(null);
    setCropEnd(null);
    setCroppedFigures([]);
    setActiveFigureId(null);
  }, [document?.id]);

  const { 
    validateFigures, 
    showValidationError, 
    showSaveSuccess,
    updateFigureField,
    deleteFigure
  } = useFigureUtils();

  // Determine if document is an image
  const isImage = isDocumentImage(document?.type);

  const handleStartCrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!croppingMode) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCropStart({ x, y });
    setCropEnd({ x, y });
  };

  const handleCropMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!croppingMode || !cropStart) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
    
    setCropEnd({ x, y });
  };

  const handleEndCrop = () => {
    if (!croppingMode || !cropStart || !cropEnd || !document) {
      setCropStart(null);
      setCropEnd(null);
      return;
    }
    
    // Skip if area is too small
    if (Math.abs(cropEnd.x - cropStart.x) < 20 || Math.abs(cropEnd.y - cropStart.y) < 20) {
      toast({
        title: "Selected area too small",
        description: "Please select a larger area.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate crop dimensions
    const cropStartX = Math.min(cropStart.x, cropEnd.x);
    const cropStartY = Math.min(cropStart.y, cropEnd.y);
    const cropWidth = Math.abs(cropEnd.x - cropStart.x);
    const cropHeight = Math.abs(cropEnd.y - cropStart.y);
    
    // For image documents, use canvas to crop
    let croppedImageUrl = "";
    if (isImage && imgRef.current) {
      try {
        croppedImageUrl = cropImage(
          imgRef.current,
          cropStartX,
          cropStartY, 
          cropWidth,
          cropHeight,
          document?.url
        );
      } catch (error) {
        console.error("Error cropping image:", error);
        toast({
          title: "Error cropping image",
          description: "There was an error processing this image. Please try again.",
          variant: "destructive"
        });
        return;
      }
    } 
    // For non-image documents, use a screenshot approach or placeholder
    else {
      // Use a placeholder or screenshot approach if implementing PDF cropping
      croppedImageUrl = document.url || "";
      toast({
        title: "Area selected",
        description: "Non-image document cropping uses the full page."
      });
    }
    
    // Create a new figure with the cropped image
    const { id, figure } = createFigureFromCrop(document, croppedImageUrl);
    setCroppedFigures(prev => [...prev, figure]);
    setActiveFigureId(id);
    
    // Reset crop state
    setCropStart(null);
    setCropEnd(null);
    setCroppingMode(false);
    
    toast({
      title: "Area selected!",
      description: "Add details to your figure.",
    });
  };

  const handleCancelCrop = () => {
    setCropStart(null);
    setCropEnd(null);
    setCroppingMode(false);
  };

  const handleFigureChange = (id: string, field: 'title' | 'description' | 'label', value: string) => {
    setCroppedFigures(currentFigures => 
      updateFigureField(currentFigures, id, field, value)
    );
  };

  const handleDeleteFigure = (id: string) => {
    setCroppedFigures(currentFigures => deleteFigure(currentFigures, id));
    if (activeFigureId === id) {
      setActiveFigureId(null);
    }
  };

  const handleSave = (): boolean => {
    // Validate figures have titles
    const { valid, index } = validateFigures(croppedFigures);
    if (!valid) {
      const figureId = showValidationError(index, croppedFigures);
      setActiveFigureId(figureId);
      return false;
    }

    if (onSaveFigures) {
      onSaveFigures(croppedFigures);
    }
    
    showSaveSuccess(croppedFigures.length);
    return true;
  };

  return {
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
  };
}

// Re-export the type for convenience
export type { CroppedFigure };
