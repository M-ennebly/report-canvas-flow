
import React, { useState } from "react";
import { Document } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import ZoomControls from "./ZoomControls";

interface OfficeDocPreviewProps {
  document: Document;
  documentType: "word" | "powerpoint";
}

const OfficeDocPreview: React.FC<OfficeDocPreviewProps> = ({
  document,
  documentType
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const docTypeName = documentType === "word" ? "Word" : "PowerPoint";

  return (
    <div className="w-full h-full relative">
      <ScrollArea className="h-full w-full">
        <div className="w-full h-full p-6">
          {document.url && document.url.startsWith('http') && (
            <iframe 
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(document.url)}`}
              className="w-full h-[calc(100vh-250px)] border"
              title={document.name || `${docTypeName} document`}
            />
          )}
          
          {document.url && !document.url.startsWith('http') && document.url.startsWith('blob:') && (
            <div className="text-center p-6 bg-slate-50 rounded-md">
              <p className="text-slate-600">To preview this {docTypeName} file, please save it first.</p>
              <p className="text-sm text-slate-500 mt-2">File: {document.name}</p>
            </div>
          )}
          
          {!document.url && (
            <div className="text-center p-6 bg-slate-50 rounded-md">
              <p className="text-slate-600">No document URL provided.</p>
              <p className="text-sm text-slate-500 mt-2">File: {document.name || "Unknown"}</p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <ZoomControls
        zoomLevel={zoomLevel}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
      />
    </div>
  );
};

export default OfficeDocPreview;
