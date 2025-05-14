
import React, { useState } from "react";
import { Document } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import ZoomControls from "./ZoomControls";
import CropOverlay from "./CropOverlay";

interface PdfPreviewProps {
  document: Document;
  croppingMode: boolean;
  cropStart: { x: number; y: number } | null;
  cropEnd: { x: number; y: number } | null;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  onMouseLeave?: () => void;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({
  document,
  croppingMode,
  cropStart,
  cropEnd,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  return (
    <div className="w-full h-full relative">
      <ScrollArea className="h-full w-full">
        <iframe
          src={`${document.url}#view=FitH&zoom=${zoomLevel * 100}`}
          className="w-full h-[calc(100vh-250px)]"
          title={document.name || "PDF document"}
        />
      </ScrollArea>
      
      <CropOverlay
        croppingMode={croppingMode}
        cropStart={cropStart}
        cropEnd={cropEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      />
      
      <ZoomControls
        zoomLevel={zoomLevel}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
      />
    </div>
  );
};

export default PdfPreview;
