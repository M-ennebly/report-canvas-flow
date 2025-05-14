
import { Document, Project } from "@/types";
import { toast } from "sonner";

export const createDocumentActions = (
  project: Project,
  setProject: React.Dispatch<React.SetStateAction<Project>>
) => {
  const handleDocumentUpload = (files: FileList | Document[]) => {
    let newDocuments: Document[] = [];
    
    if (files instanceof FileList) {
      // Handle FileList input from file uploader
      newDocuments = Array.from(files).map((file) => {
        // Get file extension
        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "unknown";
        
        // Determine file type
        let fileType = fileExtension;
        if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(fileExtension)) {
          fileType = "image";
        } else if (["doc", "docx"].includes(fileExtension)) {
          fileType = "word";
        } else if (["xls", "xlsx"].includes(fileExtension)) {
          fileType = "excel";
        } else if (["ppt", "pptx"].includes(fileExtension)) {
          fileType = "powerpoint";
        }
        
        return {
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: fileType,
          url: URL.createObjectURL(file),
          dateUploaded: new Date().toISOString(),
          label: project.documents[0]?.label
        };
      });
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
    const figures = createFiguresFromDocument(document, newTaskId, figureCount);
    
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
    handleDocumentUpload,
    handleDocumentDelete,
    handleExtractFigures
  };
};

// Helper function to create figures from a document
function createFiguresFromDocument(document: Document, taskId: string, count: number) {
  const figures = [];
  
  // Select appropriate category based on document type
  let category = "fallback";
  if (document.type === "pdf") category = "analysis";
  if (document.type === "docx") category = "quality";
  if (document.type === "pptx") category = "optical";
  
  for (let i = 0; i < count; i++) {
    figures.push({
      id: `figure-${taskId}-${i}`,
      title: `Extracted Figure ${i+1} from ${document.name}`,
      description: `Figure automatically extracted from ${document.name}`,
      imageUrl: require(`@/utils/figureImages`).figureImages[category][i % 3],
      pageNumber: Math.floor(Math.random() * 10) + 1,
      documentId: document.id
    });
  }
  
  return figures;
}
