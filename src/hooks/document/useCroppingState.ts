
import { useState, useRef } from "react";
import { CropCoordinates } from "./types";
import { toast } from "@/hooks/use-toast";
import { Document } from "@/types";
import { cropImage, createFigureFromCrop } from "./cropUtils";

interface UseCroppingStateReturn {
  croppingMode: boolean;
  cropStart: CropCoordinates | null;
  cropEnd: CropCoordinates | null;
  imgRef: React.RefObject<HTMLImageElement>;
  setCroppingMode: (mode: boolean) => void;
  handleStartCrop: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleCropMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleEndCrop: () => void;
  handleCancelCrop: () => void;
}

export function useCroppingState(
  document: Document | null,
  isImage: boolean,
  addFigure: (figure: any) => void
): UseCroppingStateReturn {
  const [croppingMode, setCroppingMode] = useState(false);
  const [cropStart, setCropStart] = useState<CropCoordinates | null>(null);
  const [cropEnd, setCropEnd] = useState<CropCoordinates | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

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
    addFigure(figure);
    
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

  return {
    croppingMode,
    cropStart,
    cropEnd,
    imgRef,
    setCroppingMode,
    handleStartCrop,
    handleCropMove,
    handleEndCrop,
    handleCancelCrop
  };
}
