
import React, { useState, useRef } from "react";
import { Document } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import ZoomControls from "./ZoomControls";
import CropOverlay from "./CropOverlay";

interface ImagePreviewProps {
  document: Document;
  croppingMode: boolean;
  cropStart: { x: number; y: number } | null;
  cropEnd: { x: number; y: number } | null;
  imgRef: React.RefObject<HTMLImageElement>;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  onMouseLeave?: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  document,
  croppingMode,
  cropStart,
  cropEnd,
  imgRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  return (
    <ScrollArea className="h-full w-full">
      <div className="relative min-h-full min-w-full overflow-visible bg-slate-100">
        <div 
          ref={previewRef}
          className="p-4 flex items-center justify-center"
        >
          <img
            ref={imgRef}
            src={document.url}
            alt={document.name || "Document preview"}
            className="max-w-full object-contain transform-gpu transition-transform"
            style={{ transform: `scale(${zoomLevel})` }}
            onLoad={() => {
              console.log("Image loaded successfully");
              setImageLoaded(true);
            }}
          />
        </div>
        
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
    </ScrollArea>
  );
};

export default ImagePreview;
