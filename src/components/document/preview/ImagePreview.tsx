
import React, { useState, useRef } from "react";
import { Document } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import ZoomControls from "./components/ZoomControls";
import CropOverlay from "./components/CropOverlay";

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
          style={{ pointerEvents: croppingMode ? 'none' : 'auto' }}
        >
          <img
            ref={imgRef}
            src={document.url}
            alt={document.name || "Document preview"}
            className="max-w-full object-contain transform-gpu transition-transform"
            style={{ transform: `scale(${zoomLevel})`, maxHeight: 'calc(100vh - 300px)' }}
            onLoad={() => {
              console.log("Image loaded successfully");
              setImageLoaded(true);
            }}
            onError={(e) => {
              console.error("Error loading image:", e);
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
