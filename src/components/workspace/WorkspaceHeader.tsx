
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Edit } from "lucide-react";
import { Project } from "@/types";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(projectName);
  
  const handleGenerateReport = () => {
    // Save project tasks to session storage before navigating
    if (project && project.tasks) {
      try {
        sessionStorage.setItem('projectTasks', JSON.stringify(project.tasks));
        // Save project description too
        sessionStorage.setItem('projectData', JSON.stringify({
          description: project.description,
          name: project.name || editedName
        }));
        toast.success("Report data prepared successfully");
      } catch (error) {
        console.error("Error saving project data for report:", error);
        toast.error("Failed to prepare report data");
      }
    }
    
    onGenerateReport();
  };

  const handleSaveName = () => {
    if (editedName.trim() === "") {
      toast.error("Project name cannot be empty");
      return;
    }
    
    // Update project name in session storage
    try {
      const projectData = JSON.parse(sessionStorage.getItem('projectData') || '{}');
      sessionStorage.setItem('projectData', JSON.stringify({
        ...projectData,
        name: editedName
      }));
      toast.success("Project name updated");
    } catch (error) {
      console.error("Error saving project name:", error);
    }
    
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setEditedName(projectName);
      setIsEditing(false);
    }
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
      
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
        {isEditing ? (
          <div className="flex items-center">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-56 text-lg font-semibold text-center"
            />
          </div>
        ) : (
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">
              {editedName} {labelId && `- ${labelId.charAt(0).toUpperCase() + labelId.slice(1)}`}
            </h1>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(true)} 
              className="ml-1 h-6 w-6 p-0"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
      
      <Button onClick={handleGenerateReport}>
        <FileText className="h-4 w-4 mr-2" />
        Generate Project Report
      </Button>
    </header>
  );
};

export default WorkspaceHeader;
