
import { Project } from "@/types";

export const createMetadataActions = (
  project: Project,
  setProject: React.Dispatch<React.SetStateAction<Project>>
) => {
  const handleDescriptionChange = (description: string) => {
    setProject({
      ...project,
      description,
    });
    
    // Save description to session storage
    try {
      sessionStorage.setItem('projectData', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('projectData') || '{}'),
        description
      }));
    } catch (error) {
      console.error("Error saving project description:", error);
    }
  };

  const handleLinkedReportChange = (reportId: string) => {
    setProject({
      ...project,
      linkedReportId: reportId === "none" ? undefined : reportId,
    });
  };

  const handleNameChange = (name: string) => {
    setProject({
      ...project,
      name,
    });
    
    // Save name to session storage
    try {
      sessionStorage.setItem('projectData', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('projectData') || '{}'),
        name
      }));
    } catch (error) {
      console.error("Error saving project name:", error);
    }
  };

  return {
    handleDescriptionChange,
    handleLinkedReportChange,
    handleNameChange
  };
};
