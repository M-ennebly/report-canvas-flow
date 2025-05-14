
import React, { useRef, useState, useEffect } from "react";
import { Document } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

interface FilePreviewProps {
  document: Document | null;
  croppingMode: boolean;
  cropStart: { x: number; y: number } | null;
  cropEnd: { x: number; y: number } | null;
  imgRef: React.RefObject<HTMLImageElement>;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  onMouseLeave?: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
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
  
  useEffect(() => {
    // Reset image loaded state when document changes
    setImageLoaded(false);
  }, [document?.id]);
  
  if (!document) return null;
  
  const isImage = document.type.toLowerCase() === "image" || 
    ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(document.type.toLowerCase() || "");

  const isPdf = document.type.toLowerCase() === "pdf";
  const isDocx = ["doc", "docx", "word"].includes(document.type.toLowerCase());
  const isPpt = ["ppt", "pptx", "powerpoint"].includes(document.type.toLowerCase());

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };
  
  // Render controls for zoom
  const renderZoomControls = () => (
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

  // Render file preview based on type
  if (isImage) {
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
              alt={document.name}
              className="max-w-full object-contain transform-gpu transition-transform"
              style={{ transform: `scale(${zoomLevel})` }}
              onLoad={() => {
                // Ensure image is loaded before allowing cropping
                console.log("Image loaded successfully");
                setImageLoaded(true);
              }}
            />
          </div>
          
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{ cursor: croppingMode ? 'crosshair' : 'default' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          >
            {cropStart && cropEnd && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none z-10"
                style={{
                  left: Math.min(cropStart.x, cropEnd.x),
                  top: Math.min(cropStart.y, cropEnd.y),
                  width: Math.abs(cropEnd.x - cropStart.x),
                  height: Math.abs(cropEnd.y - cropStart.y)
                }}
              />
            )}
          </div>
          
          {renderZoomControls()}
        </div>
      </ScrollArea>
    );
  } else if (isPdf) {
    return (
      <div className="w-full h-full relative">
        <ScrollArea className="h-full w-full">
          <iframe
            src={`${document.url}#view=FitH&zoom=${zoomLevel * 100}`}
            className="w-full h-[calc(100vh-250px)]"
            title={document.name}
          />
        </ScrollArea>
        
        {/* Overlay for PDF cropping */}
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{ cursor: croppingMode ? 'crosshair' : 'default', pointerEvents: croppingMode ? 'all' : 'none' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        >
          {cropStart && cropEnd && (
            <div
              className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none z-10"
              style={{
                left: Math.min(cropStart.x, cropEnd.x),
                top: Math.min(cropStart.y, cropEnd.y),
                width: Math.abs(cropEnd.x - cropStart.x),
                height: Math.abs(cropEnd.y - cropStart.y)
              }}
            />
          )}
        </div>
        
        {renderZoomControls()}
      </div>
    );
  } else if (isDocx) {
    return (
      <div className="w-full h-full relative">
        <ScrollArea className="h-full w-full">
          <div className="w-full h-full p-6">
            {document.url.startsWith('http') && (
              <iframe 
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(document.url)}`}
                className="w-full h-[calc(100vh-250px)] border"
                title={document.name}
              />
            )}
            
            {!document.url.startsWith('http') && document.url.startsWith('blob:') && (
              <div className="text-center p-6 bg-slate-50 rounded-md">
                <p className="text-slate-600">To preview this DOCX file, please save it first.</p>
                <p className="text-sm text-slate-500 mt-2">File: {document.name}</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {renderZoomControls()}
      </div>
    );
  } else if (isPpt) {
    return (
      <div className="w-full h-full relative">
        <ScrollArea className="h-full w-full">
          <div className="w-full h-full p-6">
            {document.url.startsWith('http') && (
              <iframe 
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(document.url)}`}
                className="w-full h-[calc(100vh-250px)] border"
                title={document.name}
              />
            )}
            
            {!document.url.startsWith('http') && (
              <div className="text-center p-6 bg-slate-50 rounded-md">
                <p className="text-slate-600">To preview this PowerPoint file, please save it first.</p>
                <p className="text-sm text-slate-500 mt-2">File: {document.name}</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {renderZoomControls()}
      </div>
    );
  } else {
    return (
      <div className="w-full h-full text-center p-10 bg-slate-100 flex flex-col items-center justify-center rounded-md">
        <div className="text-xl font-medium text-slate-600 mb-2">{document.type.toUpperCase()}</div>
        <p className="text-slate-600">{document.name}</p>
        <p className="mt-4 text-sm text-slate-500">Preview not available for this file type.</p>
      </div>
    );
  }
};

export default FilePreview;
