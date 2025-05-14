
import React, { useRef } from "react";
import { Document } from "@/types";
import FilePreview from "./FilePreview";
import CroppingToolbar from "./CroppingToolbar";

interface PreviewPanelProps {
  document: Document | null;
  isImage: boolean;
  croppingMode: boolean;
  cropStart: { x: number; y: number } | null;
  cropEnd: { x: number; y: number } | null;
  onStartCropping: () => void;
  onCancelCrop: () => void;
  onCompleteCrop: () => void;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  document,
  isImage,
  croppingMode,
  cropStart,
  cropEnd,
  onStartCropping,
  onCancelCrop,
  onCompleteCrop,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="md:col-span-2 h-full flex flex-col" ref={previewRef}>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-slate-500">
          {document?.type.toUpperCase()}
        </div>
        
        <CroppingToolbar 
          isImage={!!isImage}
          croppingMode={croppingMode}
          isCropSelected={!!(cropStart && cropEnd)}
          onStartCropping={onStartCropping}
          onCancelCrop={onCancelCrop}
          onCompleteCrop={onCompleteCrop}
        />
      </div>
      <div className="flex-1 overflow-hidden border rounded-md bg-slate-50">
        <FilePreview 
          document={document}
          croppingMode={croppingMode}
          cropStart={cropStart}
          cropEnd={cropEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        />
      </div>
    </div>
  );
};

export default PreviewPanel;
