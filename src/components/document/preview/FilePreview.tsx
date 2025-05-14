
import React, { useRef } from "react";
import { Document } from "@/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FilePreviewProps {
  document: Document | null;
  croppingMode: boolean;
  cropStart: { x: number; y: number } | null;
  cropEnd: { x: number; y: number } | null;
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
      <div 
        ref={previewRef}
        className="relative w-full overflow-hidden bg-slate-100"
        style={{ cursor: croppingMode ? 'crosshair' : 'default' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={cropStart ? onMouseLeave : undefined}
      >
        <AspectRatio ratio={16/9} className="bg-slate-100">
          <img
            src={document.url}
            alt={document.name}
            className="h-full w-full object-contain"
          />
        </AspectRatio>
        
        {cropStart && cropEnd && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
            style={{
              left: Math.min(cropStart.x, cropEnd.x),
              top: Math.min(cropStart.y, cropEnd.y),
              width: Math.abs(cropEnd.x - cropStart.x),
              height: Math.abs(cropEnd.y - cropStart.y)
            }}
          />
        )}
      </div>
    );
  } else if (document.type === "pdf") {
    return (
      <div className="w-full text-center p-10 bg-slate-100 flex flex-col items-center justify-center rounded-md">
        <div className="text-3xl font-bold text-red-500 mb-2">PDF</div>
        <p className="text-slate-600">{document.name}</p>
        <p className="mt-4 text-sm text-slate-500">Preview not available for PDF files.</p>
      </div>
    );
  } else if (["doc", "docx", "word"].includes(document.type.toLowerCase())) {
    return (
      <div className="w-full text-center p-10 bg-slate-100 flex flex-col items-center justify-center rounded-md">
        <div className="text-3xl font-bold text-blue-500 mb-2">DOCX</div>
        <p className="text-slate-600">{document.name}</p>
        <p className="mt-4 text-sm text-slate-500">Preview not available for Word documents.</p>
      </div>
    );
  } else if (["ppt", "pptx", "powerpoint"].includes(document.type.toLowerCase())) {
    return (
      <div className="w-full text-center p-10 bg-slate-100 flex flex-col items-center justify-center rounded-md">
        <div className="text-3xl font-bold text-orange-500 mb-2">PPT</div>
        <p className="text-slate-600">{document.name}</p>
        <p className="mt-4 text-sm text-slate-500">Preview not available for PowerPoint files.</p>
      </div>
    );
  } else {
    return (
      <div className="w-full text-center p-10 bg-slate-100 flex flex-col items-center justify-center rounded-md">
        <div className="text-xl font-medium text-slate-600 mb-2">{document.type.toUpperCase()}</div>
        <p className="text-slate-600">{document.name}</p>
        <p className="mt-4 text-sm text-slate-500">Preview not available for this file type.</p>
      </div>
    );
  }
};

export default FilePreview;
