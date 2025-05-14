
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";
import { Project } from "@/types";
import { toast } from "sonner";

interface WorkspaceHeaderProps {
  projectName: string;
  labelId?: string;
  onGenerateReport: () => void;
  project?: Project;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  projectName,
  labelId,
  onGenerateReport,
  project
}) => {
  const navigate = useNavigate();
  
  const handleGenerateReport = () => {
    // Save project tasks to session storage before navigating
    if (project && project.tasks) {
      try {
        sessionStorage.setItem('projectTasks', JSON.stringify(project.tasks));
        // Save project description too
        sessionStorage.setItem('projectData', JSON.stringify({
          description: project.description
        }));
        toast.success("Report data prepared successfully");
      } catch (error) {
        console.error("Error saving project data for report:", error);
        toast.error("Failed to prepare report data");
      }
    }
    
    onGenerateReport();
  };
  
  return (
    <header className="bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate("/")} className="mr-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <img src="/lovable-uploads/a868b9c0-a265-4983-86f4-3c67b7127c4a.png" alt="DigiClaim Logo" className="h-6" />
      </div>
      
      <h1 className="text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">
        {projectName} {labelId && `- ${labelId.charAt(0).toUpperCase() + labelId.slice(1)}`}
      </h1>
      
      <Button onClick={handleGenerateReport}>
        <FileText className="h-4 w-4 mr-2" />
        Generate Project Report
      </Button>
    </header>
  );
};

export default WorkspaceHeader;
