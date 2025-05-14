
import { Document } from "@/types";
import { 
  CroppedFigure, 
  UseDocumentPreviewReturn 
} from "./types";
import { useDocumentType } from "./useDocumentType";
import { useCroppingState } from "./useCroppingState";
import { useFiguresState } from "./useFiguresState";
import { useCallback } from "react";

export function useDocumentPreview(
  document: Document | null,
  onSaveFigures?: (figures: CroppedFigure[]) => void
): UseDocumentPreviewReturn {
  // Get document type
  const { isImage } = useDocumentType(document);

  // Handle figures state
  const {
    croppedFigures,
    activeFigureId,
    setActiveFigureId,
    handleFigureChange,
    handleDeleteFigure,
    addFigure,
    handleSave
  } = useFiguresState(document, onSaveFigures);

  // Handle cropping state
  const {
    croppingMode,
    cropStart,
    cropEnd,
    imgRef,
    setCroppingMode,
    handleStartCrop,
    handleCropMove,
    handleEndCrop,
    handleCancelCrop
  } = useCroppingState(document, isImage, addFigure);

  // Return combined hooks
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
