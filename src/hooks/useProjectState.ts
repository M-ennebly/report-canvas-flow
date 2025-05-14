
import { useState } from "react";
import { Project, Task } from "@/types";
import { generateDemoTasks } from "@/utils/demoData";
import { toast } from "sonner";

export const useProjectState = (labelId?: string) => {
  const [project, setProject] = useState<Project>({
    id: "demo-project",
    name: "Consultant Report Project",
    description: "",
    documents: [],
    tasks: generateDemoTasks(labelId),
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

  const handleDocumentUpload = (files: FileList) => {
    const newDocuments = Array.from(files).map((file) => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.name.split(".").pop() || "unknown",
      url: URL.createObjectURL(file),
      dateUploaded: new Date().toISOString(),
    }));

    setProject({
      ...project,
      documents: [...project.documents, ...newDocuments],
    });
  };
  
  const handleDocumentDelete = (documentId: string) => {
    setProject({
      ...project,
      documents: project.documents.filter(doc => doc.id !== documentId)
    });
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
