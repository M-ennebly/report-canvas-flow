
import { useState } from "react";
import { Project, Task, Document } from "@/types";
import { generateDemoTasks } from "@/utils/demoData";
import { toast } from "sonner";

export const useProjectState = (
  labelId?: string, 
  initialDocuments: Document[] = [],
  selectedLabels: string[] = []
) => {
  const [project, setProject] = useState<Project>({
    id: "demo-project",
    name: "Consultant Report Project",
    description: "",
    documents: initialDocuments,
    tasks: generateDemoTasks(labelId, selectedLabels),
  });

  const handleTaskMove = (taskId: string, sourceColumn: string, targetColumn: string) => {
    setProject({
      ...project,
      tasks: project.tasks.map((task) =>
        task.id === taskId
          ? { ...task, column: targetColumn as "design" | "analyse" | "dev" | "testing" }
          : task
      ),
    });
    toast.success(`Task moved to ${targetColumn}`);
  };

  const handleSaveTask = (updatedTask: Task) => {
    setProject({
      ...project,
      tasks: project.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    });
  };

  const handleDescriptionChange = (description: string) => {
    setProject({
      ...project,
      description,
    });
  };

  const handleLinkedReportChange = (reportId: string) => {
    setProject({
      ...project,
      linkedReportId: reportId === "none" ? undefined : reportId,
    });
  };

  // Updated to handle both FileList and Document[] inputs
  const handleDocumentUpload = (files: FileList | Document[]) => {
    let newDocuments: Document[] = [];
    
    if (files instanceof FileList) {
      // Handle FileList input from file uploader
      newDocuments = Array.from(files).map((file) => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.name.split(".").pop() || "unknown",
        url: URL.createObjectURL(file),
        dateUploaded: new Date().toISOString(),
      }));
    } else {
      // Handle Document[] input from session storage
      newDocuments = files;
    }

    setProject({
      ...project,
      documents: [...project.documents, ...newDocuments],
    });
    
    if (newDocuments.length > 0) {
      toast.success(`${newDocuments.length} document(s) added`);
    }
  };
  
  const handleDocumentDelete = (documentId: string) => {
    setProject({
      ...project,
      documents: project.documents.filter(doc => doc.id !== documentId)
    });
    toast.success("Document deleted");
  };

  return {
    project,
    handleTaskMove,
    handleSaveTask,
    handleDescriptionChange,
    handleLinkedReportChange,
    handleDocumentUpload,
    handleDocumentDelete
  };
};
