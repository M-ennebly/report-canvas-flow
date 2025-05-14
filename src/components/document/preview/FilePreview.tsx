
import React, { useRef } from "react";
import { Document } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  if (!document) return null;
  
  const isImage = document.type.toLowerCase() === "image" || 
    ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(document.type.toLowerCase() || "");

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
              className="max-w-full object-contain"
              onLoad={() => {
                // Ensure image is loaded before allowing cropping
                console.log("Image loaded successfully");
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
        </div>
      </ScrollArea>
    );
  } else if (document.type === "pdf") {
    return (
      <div className="w-full h-full text-center p-10 bg-slate-100 flex flex-col items-center justify-center rounded-md">
        <div className="text-3xl font-bold text-red-500 mb-2">PDF</div>
        <p className="text-slate-600">{document.name}</p>
        <p className="mt-4 text-sm text-slate-500">Preview not available for PDF files.</p>
      </div>
    );
  } else if (["doc", "docx", "word"].includes(document.type.toLowerCase())) {
    return (
      <div className="w-full h-full text-center p-10 bg-slate-100 flex flex-col items-center justify-center rounded-md">
        <div className="text-3xl font-bold text-blue-500 mb-2">DOCX</div>
        <p className="text-slate-600">{document.name}</p>
        <p className="mt-4 text-sm text-slate-500">Preview not available for Word documents.</p>
      </div>
    );
  } else if (["ppt", "pptx", "powerpoint"].includes(document.type.toLowerCase())) {
    return (
      <div className="w-full h-full text-center p-10 bg-slate-100 flex flex-col items-center justify-center rounded-md">
        <div className="text-3xl font-bold text-orange-500 mb-2">PPT</div>
        <p className="text-slate-600">{document.name}</p>
        <p className="mt-4 text-sm text-slate-500">Preview not available for PowerPoint files.</p>
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
