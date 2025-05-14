
import { useState } from "react";
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

  const handleEndCrop = () => {
    if (!croppingMode || !cropStart || !cropEnd || !document) return;
    
    // Skip if area is too small
    if (Math.abs(cropEnd.x - cropStart.x) < 20 || Math.abs(cropEnd.y - cropStart.y) < 20) {
      toast({
        description: "Selected area is too small. Please select a larger area.",
        variant: "destructive"
      });
      return;
    }
    
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
