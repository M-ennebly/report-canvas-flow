
import React from "react";
import { Button } from "@/components/ui/button";
import { Crop, X, Check } from "lucide-react";

interface CroppingToolbarProps {
  isImage: boolean;
  croppingMode: boolean;
  isCropSelected: boolean;
  onStartCropping: () => void;
  onCancelCrop: () => void;
  onCompleteCrop: () => void;
}

const CroppingToolbar: React.FC<CroppingToolbarProps> = ({
  isImage,
  croppingMode,
  isCropSelected,
  onStartCropping,
  onCancelCrop,
  onCompleteCrop,
}) => {
  // Show crop button for all document types
  if (!croppingMode) {
    return (
      <Button 
        onClick={onStartCropping} 
        variant="outline" 
        size="sm"
        className="flex items-center gap-1"
      >
        <Crop className="h-4 w-4" />
        Crop Figure
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button 
        onClick={onCancelCrop} 
        variant="outline" 
        size="sm"
        className="flex items-center gap-1"
      >
        <X className="h-4 w-4" />
        Cancel
      </Button>
      <Button 
        variant="secondary" 
        size="sm"
        disabled={!isCropSelected}
        onClick={onCompleteCrop}
        className="flex items-center gap-1"
      >
        <Check className="h-4 w-4" />
        Select Area
      </Button>
    </div>
  );
};

export default CroppingToolbar;
