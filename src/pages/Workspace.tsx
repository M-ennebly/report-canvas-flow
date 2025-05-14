
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import WorkspaceContent from "@/components/workspace/WorkspaceContent";
import { Document } from "@/types";

const Workspace = () => {
  const { uploadType, labelId } = useParams<{ uploadType: string; labelId?: string }>();
  const navigate = useNavigate();
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [workspaceProject, setWorkspaceProject] = useState(null);
  const [projectName, setProjectName] = useState("Consultant Report Project");

  useEffect(() => {
    // Check for uploaded documents in session storage
    const storedDocuments = sessionStorage.getItem('uploadedDocuments');
    if (storedDocuments) {
      try {
        const documents = JSON.parse(storedDocuments);
        if (Array.isArray(documents) && documents.length > 0) {
          setUploadedDocuments(documents);
          console.log("Loaded documents from session storage:", documents);
          toast({
            title: "Documents loaded",
            description: `${documents.length} documents are ready to use`
          });
        } else {
          console.log("No documents found in session storage or empty array");
          toast({
            title: "No documents",
            description: "No documents were uploaded"
          });
        }
      } catch (error) {
        console.error("Error parsing uploaded documents:", error);
        toast({
          title: "Error loading documents",
          description: "There was an error loading your documents",
          variant: "destructive"
        });
      }
    } else {
      console.log("No documents found in session storage");
      toast({
        title: "No documents",
        description: "No documents were uploaded"
      });
    }
    
    // Check for selected labels in label-based upload
    if (uploadType === "label") {
      const storedLabels = sessionStorage.getItem('selectedLabels');
      if (storedLabels) {
        try {
          const labels = JSON.parse(storedLabels);
          setSelectedLabels(labels);
        } catch (error) {
          console.error("Error parsing selected labels:", error);
        }
      }
      
      if (labelId) {
        toast({
          title: "Ready to work",
          description: `Ready to work with documents for the ${labelId.charAt(0).toUpperCase() + labelId.slice(1)} stage`
        });
      }
    }

    // Check for project name in session storage
    const storedProjectData = sessionStorage.getItem('projectData');
    if (storedProjectData) {
      try {
        const projectData = JSON.parse(storedProjectData);
        if (projectData.name) {
          setProjectName(projectData.name);
        }
      } catch (error) {
        console.error("Error parsing project data:", error);
      }
    }
  }, [uploadType, labelId]);

  const handleGenerateReport = () => {
    navigate(`/report/demo-project`);
  };

  // Callback to get the current project state from WorkspaceContent
  const handleProjectUpdate = (project) => {
    setWorkspaceProject(project);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-slate-100">
      <WorkspaceHeader 
        projectName={projectName}
        labelId={labelId}
        onGenerateReport={handleGenerateReport}
        project={workspaceProject}
      />
      <WorkspaceContent 
        labelId={labelId} 
        initialDocuments={uploadedDocuments} 
        selectedLabels={selectedLabels}
        onProjectUpdate={handleProjectUpdate}
      />
    </div>
  );
};

export default Workspace;
