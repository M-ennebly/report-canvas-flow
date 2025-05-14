
import React, { useRef, useState, useEffect } from "react";
import { Document } from "@/types";
import ImagePreview from "./components/ImagePreview";
import PdfPreview from "./components/PdfPreview";
import OfficeDocPreview from "./components/OfficeDocPreview";
import FallbackPreview from "./components/FallbackPreview";
import { isImageFile, isPdfFile, isWordFile, isPowerPointFile } from "./utils/fileTypeUtils";

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
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    // Reset image loaded state when document changes
    setImageLoaded(false);
  }, [document?.id]);
  
  if (!document) return null;

  // Determine file type
  const isImage = isImageFile(document.type);
  const isPdf = isPdfFile(document.type);
  const isWord = isWordFile(document.type);
  const isPowerPoint = isPowerPointFile(document.type);

  // Render file preview based on type
  if (isImage) {
    return (
      <ImagePreview
        document={document}
        croppingMode={croppingMode}
        cropStart={cropStart}
        cropEnd={cropEnd}
        imgRef={imgRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      />
    );
  } else if (isPdf) {
    return (
      <PdfPreview
        document={document}
        croppingMode={croppingMode}
        cropStart={cropStart}
        cropEnd={cropEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      />
    );
  } else if (isWord) {
    return (
      <OfficeDocPreview
        document={document}
        documentType="word"
      />
    );
  } else if (isPowerPoint) {
    return (
      <OfficeDocPreview
        document={document}
        documentType="powerpoint"
      />
    );
  } else {
    return (
      <FallbackPreview document={document} />
    );
  }
};

export default FilePreview;
