
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";

interface WorkspaceHeaderProps {
  projectName: string;
  labelId?: string;
  onGenerateReport: () => void;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  projectName,
  labelId,
  onGenerateReport
}) => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate("/")} className="mr-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-lg font-semibold">
          {projectName} {labelId && `- ${labelId.charAt(0).toUpperCase() + labelId.slice(1)}`}
        </h1>
      </div>
      <Button onClick={onGenerateReport}>
        <FileText className="h-4 w-4 mr-2" />
        Generate Project Report
      </Button>
    </header>
  );
};

export default WorkspaceHeader;
