
import React from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

interface ZoomControlsProps {
  zoomLevel: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoomLevel,
  handleZoomIn,
  handleZoomOut,
}) => {
  return (
    <div className="absolute top-3 right-3 bg-white rounded-md shadow-sm border flex">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleZoomOut}
        disabled={zoomLevel <= 0.5}
        className="h-8 w-8"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <div className="flex items-center px-2 text-xs font-medium">
        {Math.round(zoomLevel * 100)}%
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleZoomIn}
        disabled={zoomLevel >= 3}
        className="h-8 w-8"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ZoomControls;
