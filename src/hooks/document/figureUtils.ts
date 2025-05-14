
import { CroppedFigure } from "./types";
import { toast } from "@/hooks/use-toast"; 

/**
 * Returns utility functions for managing figures
 */
export const useFigureUtils = () => {
  /**
   * Validates if all figures have required fields completed
   */
  const validateFigures = (figures: CroppedFigure[]): { valid: boolean, index: number } => {
    const incompleteIndex = figures.findIndex(fig => !fig.title.trim());
    const valid = incompleteIndex < 0;
    
    return { valid, index: incompleteIndex };
  };

  /**
   * Shows validation error message for incomplete figures
   */
  const showValidationError = (index: number, figures: CroppedFigure[]): string => {
    toast({
      title: "Missing title",
      description: "Please add a title to all figures",
      variant: "destructive"
    });
    
    return figures[index]?.id || "";
  };

  /**
   * Shows success message after figures are saved
   */
  const showSaveSuccess = (count: number) => {
    toast({
      title: "Figures saved",
      description: `${count} figures saved successfully`,
    });
  };

  /**
   * Updates a specific field of a figure
   */
  const updateFigureField = (
    figures: CroppedFigure[],
    id: string, 
    field: 'title' | 'description' | 'label', 
    value: string
  ): CroppedFigure[] => {
    return figures.map((figure) =>
      figure.id === id ? { ...figure, [field]: value } : figure
    );
  };

  /**
   * Removes a figure from the collection
   */
  const deleteFigure = (figures: CroppedFigure[], id: string): CroppedFigure[] => {
    return figures.filter((figure) => figure.id !== id);
  };

  return {
    validateFigures,
    showValidationError,
    showSaveSuccess,
    updateFigureField,
    deleteFigure
  };
};
