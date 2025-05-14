
import { useState, useEffect } from "react";
import { CroppedFigure } from "./types";
import { Document } from "@/types";
import { useFigureUtils } from "./figureUtils";
import { toast } from "@/hooks/use-toast";

interface UseFiguresStateReturn {
  croppedFigures: CroppedFigure[];
  activeFigureId: string | null;
  setActiveFigureId: (id: string | null) => void;
  handleFigureChange: (id: string, field: 'title' | 'description' | 'label', value: string) => void;
  handleDeleteFigure: (id: string) => void;
  addFigure: (figure: CroppedFigure) => void;
  handleSave: () => boolean;
}

export function useFiguresState(
  document: Document | null,
  onSaveFigures?: (figures: CroppedFigure[]) => void
): UseFiguresStateReturn {
  const [croppedFigures, setCroppedFigures] = useState<CroppedFigure[]>([]);
  const [activeFigureId, setActiveFigureId] = useState<string | null>(null);

  // Reset state when document changes
  useEffect(() => {
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

  const addFigure = (figure: CroppedFigure) => {
    setCroppedFigures(prev => [...prev, figure]);
    setActiveFigureId(figure.id);
  };

  const handleSave = (): boolean => {
    try {
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
    } catch (error) {
      console.error("Error saving figures:", error);
      toast({
        title: "Error saving figures",
        description: "There was an error saving your figures. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    croppedFigures,
    activeFigureId,
    setActiveFigureId,
    handleFigureChange,
    handleDeleteFigure,
    addFigure,
    handleSave
  };
}
