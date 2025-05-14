
import { useState, useRef } from "react";
import { Document } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CroppedFigure {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sourceDocumentId: string;
  label?: string;
}

export function useDocumentPreview(document: Document | null, onSaveFigures?: (figures: CroppedFigure[]) => void) {
  const { toast } = useToast();
  const [croppingMode, setCroppingMode] = useState(false);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null);
  const [croppedFigures, setCroppedFigures] = useState<CroppedFigure[]>([]);
  const [activeFigureId, setActiveFigureId] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const isImage = document?.type.toLowerCase() === "image" || 
    ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(document?.type.toLowerCase() || "");

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

  // Generate a cropped image from the original image using canvas
  const cropImage = (
    image: HTMLImageElement, 
    cropStartX: number, 
    cropStartY: number,
    cropWidth: number,
    cropHeight: number
  ): string => {
    // Create a canvas element
    const canvas = window.document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    
    // Get the 2D context of the canvas
    const context = canvas.getContext('2d');
    if (!context) {
      console.error("Failed to get canvas context");
      return document?.url || '';
    }
    
    // Draw the cropped portion of the image onto the canvas
    context.drawImage(
      image,
      cropStartX, 
      cropStartY,
      cropWidth, 
      cropHeight,
      0, 
      0,
      cropWidth, 
      cropHeight
    );
    
    // Convert the canvas to a data URL and return it
    return canvas.toDataURL('image/png');
  };

  const handleEndCrop = () => {
    if (!croppingMode || !cropStart || !cropEnd || !document || !imgRef.current) return;
    
    // Skip if area is too small
    if (Math.abs(cropEnd.x - cropStart.x) < 20 || Math.abs(cropEnd.y - cropStart.y) < 20) {
      toast({
        description: "Selected area is too small. Please select a larger area.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate crop dimensions
    const cropStartX = Math.min(cropStart.x, cropEnd.x);
    const cropStartY = Math.min(cropStart.y, cropEnd.y);
    const cropWidth = Math.abs(cropEnd.x - cropStart.x);
    const cropHeight = Math.abs(cropEnd.y - cropStart.y);
    
    // Generate the cropped image
    const croppedImageUrl = cropImage(
      imgRef.current,
      cropStartX,
      cropStartY, 
      cropWidth,
      cropHeight
    );
    
    // Create a new figure with the cropped image
    const id = `figure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newFigure: CroppedFigure = {
      id,
      title: `Figure from ${document.name}`,
      description: "",
      imageUrl: croppedImageUrl,
      sourceDocumentId: document.id,
      label: document.label // Inherit label from source document if available
    };

    setCroppedFigures([...croppedFigures, newFigure]);
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
      toast({
        title: "Missing title",
        description: "Please add a title to all figures",
        variant: "destructive"
      });
      setActiveFigureId(croppedFigures[incompleteIndex].id);
      return;
    }

    if (onSaveFigures) {
      onSaveFigures(croppedFigures);
    }
    toast({
      title: "Figures saved",
      description: `${croppedFigures.length} figures saved successfully`,
    });
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

export type { CroppedFigure };
