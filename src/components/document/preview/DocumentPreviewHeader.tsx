
import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DocumentPreviewHeaderProps {
  documentName: string | undefined;
}

const DocumentPreviewHeader: React.FC<DocumentPreviewHeaderProps> = ({ documentName }) => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-lg">
        {documentName}
      </DialogTitle>
    </DialogHeader>
  );
};

export default DocumentPreviewHeader;
