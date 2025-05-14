
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

  return {
    handleDescriptionChange,
    handleLinkedReportChange
  };
};
