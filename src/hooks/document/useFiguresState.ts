
import { useState, useCallback, useEffect } from "react";
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

  const handleFigureChange = useCallback((id: string, field: 'title' | 'description' | 'label', value: string) => {
    setCroppedFigures(currentFigures => 
      updateFigureField(currentFigures, id, field, value)
    );
  }, [updateFigureField]);

  const handleDeleteFigure = useCallback((id: string) => {
    setCroppedFigures(currentFigures => deleteFigure(currentFigures, id));
    setActiveFigureId((current) => current === id ? null : current);
  }, [deleteFigure]);

  const addFigure = useCallback((figure: CroppedFigure) => {
    console.log("Adding new figure:", figure);
    setCroppedFigures(prev => [...prev, figure]);
    setActiveFigureId(figure.id);
  }, []);

  const handleSave = useCallback((): boolean => {
    try {
      // Validate figures have titles
      const { valid, index } = validateFigures(croppedFigures);
      if (!valid) {
        const figureId = showValidationError(index, croppedFigures);
        setActiveFigureId(figureId);
        return false;
      }

      if (onSaveFigures) {
        console.log("Saving figures:", croppedFigures);
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
  }, [croppedFigures, onSaveFigures, showSaveSuccess, showValidationError, validateFigures]);

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
