
import React from "react";
import { Document } from "@/types";

interface FallbackPreviewProps {
  document: Document;
}

const FallbackPreview: React.FC<FallbackPreviewProps> = ({ document }) => {
  return (
    <div className="w-full h-full text-center p-10 bg-slate-100 flex flex-col items-center justify-center rounded-md">
      <div className="text-xl font-medium text-slate-600 mb-2">{document.type?.toUpperCase() || "Unknown Type"}</div>
      <p className="text-slate-600">{document.name || "Unnamed document"}</p>
      <p className="mt-4 text-sm text-slate-500">Preview not available for this file type.</p>
    </div>
  );
};

export default FallbackPreview;
