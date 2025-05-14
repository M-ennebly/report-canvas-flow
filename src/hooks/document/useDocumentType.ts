
import { Document } from "@/types";
import { isDocumentImage } from "./cropUtils";

interface UseDocumentTypeReturn {
  isImage: boolean;
}

export function useDocumentType(document: Document | null): UseDocumentTypeReturn {
  // Determine if document is an image
  const isImage = document ? isDocumentImage(document.type) : false;

  return {
    isImage
  };
}
