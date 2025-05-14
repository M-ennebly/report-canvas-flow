
import { useState, useEffect } from "react";
import { Project, Task, Document, Figure } from "@/types";
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
    documents: [],
    tasks: generateDemoTasks(labelId, selectedLabels, true), // Add parameter to reduce duplicates
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

  const handleDeleteTask = (taskId: string) => {
    setProject({
      ...project,
      tasks: project.tasks.filter(task => task.id !== taskId)
    });
    toast.success("Task deleted");
  };

  const handleDeleteFigure = (taskId: string, figureId: string) => {
    setProject({
      ...project,
      tasks: project.tasks.map(task => 
        task.id === taskId 
          ? { ...task, figures: task.figures.filter(figure => figure.id !== figureId) }
          : task
      )
    });
    toast.success("Figure deleted");
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

  // Handle document upload - can take either FileList or Document[] inputs
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
        label: labelId
      }));
    } else {
      // Handle Document[] input from session storage
      newDocuments = files;
    }

    setProject(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments]
    }));
    
    if (newDocuments.length > 0) {
      console.log("Documents added:", newDocuments);
      toast.success(`${newDocuments.length} document(s) added`);
      
      // Save to session storage
      try {
        const allDocuments = [...project.documents, ...newDocuments];
        sessionStorage.setItem('uploadedDocuments', JSON.stringify(allDocuments));
      } catch (error) {
        console.error("Error saving documents to session storage:", error);
      }
    }
  };
  
  const handleDocumentDelete = (documentId: string) => {
    const updatedDocuments = project.documents.filter(doc => doc.id !== documentId);
    
    setProject({
      ...project,
      documents: updatedDocuments
    });
    
    // Update session storage
    try {
      sessionStorage.setItem('uploadedDocuments', JSON.stringify(updatedDocuments));
    } catch (error) {
      console.error("Error updating documents in session storage:", error);
    }
    
    toast.success("Document deleted");
  };

  const handleExtractFigures = (documentId: string) => {
    // In a real app, this would call an API to extract figures from the document
    // For demo purposes, we'll create some random figures and add them to a new task
    const document = project.documents.find(doc => doc.id === documentId);
    if (!document) return;
    
    const newTaskId = `task-extract-${Date.now()}`;
    const columnChoices = ["design", "analyse", "dev", "testing"];
    const randomColumn = columnChoices[Math.floor(Math.random() * columnChoices.length)] as "design" | "analyse" | "dev" | "testing";
    
    // Create 2-4 random figures
    const figureCount = Math.floor(Math.random() * 3) + 2;
    const figures: Figure[] = [];
    
    // Select appropriate category based on document type
    let category = "fallback";
    if (document.type === "pdf") category = "analysis";
    if (document.type === "docx") category = "quality";
    if (document.type === "pptx") category = "optical";
    
    for (let i = 0; i < figureCount; i++) {
      figures.push({
        id: `figure-${newTaskId}-${i}`,
        title: `Extracted Figure ${i+1} from ${document.name}`,
        description: `Figure automatically extracted from ${document.name}`,
        imageUrl: require(`@/utils/figureImages`).figureImages[category][i % 3],
        pageNumber: Math.floor(Math.random() * 10) + 1,
        documentId: document.id
      });
    }
    
    // Create new task with the extracted figures
    const newTask = {
      id: newTaskId,
      title: `Figures from ${document.name}`,
      figures,
      column: randomColumn
    };
    
    setProject({
      ...project,
      tasks: [...project.tasks, newTask]
    });
    
    toast.success(`Extracted ${figureCount} figures from ${document.name}`);
  };

  return {
    project,
    handleTaskMove,
    handleSaveTask,
    handleDeleteTask,
    handleDeleteFigure,
    handleDescriptionChange,
    handleLinkedReportChange,
    handleDocumentUpload,
    handleDocumentDelete,
    handleExtractFigures
  };
};
