
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface MobileDocumentToggleProps {
  onToggle: () => void;
}

const MobileDocumentToggle: React.FC<MobileDocumentToggleProps> = ({ onToggle }) => {
  return (
    <div className="md:hidden fixed bottom-4 left-4">
      <Button 
        variant="secondary"
        onClick={onToggle}
        className="rounded-full h-12 w-12 p-0 shadow-lg"
      >
        <FileText className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MobileDocumentToggle;
