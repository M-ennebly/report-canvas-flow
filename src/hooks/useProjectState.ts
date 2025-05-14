
import { useState, useEffect } from "react";
import { Project } from "@/types";
import { generateDemoTasks } from "@/utils/demoData";
import { createTaskActions } from "./project/taskActions";
import { createDocumentActions } from "./project/documentActions";
import { createMetadataActions } from "./project/metadataActions";
import { ProjectStateProps, UseProjectStateReturn } from "./project/types";

export const useProjectState = (
  labelId?: string, 
  initialDocuments = [],
  selectedLabels = []
): UseProjectStateReturn => {
  const [project, setProject] = useState<Project>({
    id: "demo-project",
    name: "Consultant Report Project",
    description: "",
    documents: [],
    tasks: generateDemoTasks(labelId, selectedLabels, true),
  });

  // Initialize project with initial documents
  useEffect(() => {
    if (initialDocuments && initialDocuments.length > 0) {
      setProject(prev => ({
        ...prev,
        documents: [...initialDocuments]
      }));
    }
    
    // Load project data from session storage if available
    const storedProjectData = sessionStorage.getItem('projectData');
    if (storedProjectData) {
      try {
        const projectData = JSON.parse(storedProjectData);
        if (projectData.description) {
          setProject(prev => ({
            ...prev,
            description: projectData.description
          }));
        }
      } catch (error) {
        console.error("Error loading project data:", error);
      }
    }
  }, [initialDocuments]);
  
  // Save tasks to session storage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem('projectTasks', JSON.stringify(project.tasks));
    } catch (error) {
      console.error("Error saving tasks to session storage:", error);
    }
  }, [project.tasks]);

  // Create action handlers
  const taskActions = createTaskActions(project, setProject);
  const documentActions = createDocumentActions(project, setProject);
  const metadataActions = createMetadataActions(project, setProject);

  return {
    project,
    ...taskActions,
    ...documentActions,
    ...metadataActions
  };
};
