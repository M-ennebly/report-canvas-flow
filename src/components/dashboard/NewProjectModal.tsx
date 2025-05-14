
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import EnhancedUploadSection from "@/components/upload/EnhancedUploadSection";
import { Document } from "@/types";

interface NewProjectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewProjectModal = ({ isOpen, onOpenChange }: NewProjectModalProps) => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [bulkFiles, setBulkFiles] = useState<FileList | null>(null);
  const [bulkDocuments, setBulkDocuments] = useState<Document[]>([]);
  const [labelFiles, setLabelFiles] = useState<FileList | null>(null);
  const [labelDocuments, setLabelDocuments] = useState<Document[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadType, setUploadType] = useState<"bulk" | "label">("bulk");

  const handleBulkUpload = (files: FileList) => {
    setBulkFiles(files);
    // Handle file to document conversion
    const newDocuments: Document[] = Array.from(files).map((file) => {
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "unknown";
      
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
        dateUploaded: new Date().toISOString()
      };
    });
    
    setBulkDocuments(newDocuments);
  };

  const handleLabelUpload = (files: FileList, labelId: string) => {
    setLabelFiles(files);
    
    // Handle file to document conversion with labels
    const newDocuments: Document[] = Array.from(files).map((file) => {
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "unknown";
      
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
        label: labelId
      };
    });
    
    setLabelDocuments(prev => [...prev, ...newDocuments]);
  };

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    if ((uploadType === "bulk" && bulkDocuments.length === 0) || 
        (uploadType === "label" && labelDocuments.length === 0)) {
      toast.error("Please upload at least one document");
      return;
    }

    setIsLoading(true);

    // Save documents to session storage for retrieval in workspace
    const documentsToSave = uploadType === "bulk" ? bulkDocuments : labelDocuments;
    try {
      sessionStorage.setItem('uploadedDocuments', JSON.stringify(documentsToSave));
      
      // Save project data
      sessionStorage.setItem('projectData', JSON.stringify({
        name: projectName,
      }));
    } catch (error) {
      console.error("Error saving to session storage:", error);
    }

    // Simulate loading
    setTimeout(() => {
      toast.success("Project created successfully!");
      setIsLoading(false);
      onOpenChange(false);
      
      // Navigate to workspace
      const route = uploadType === "bulk" ? "bulk" : `label/${selectedLabels.join("-")}`;
      navigate(`/workspace/${route}`);
    }, 1000);
  };

  const handleProcessFiles = (uploadType: 'bulk' | 'label') => {
    // This function would be called when processing files
    // In the current implementation, we're using handleCreateProject to handle both creation and processing
  };

  const removeBulkDocument = (docId: string) => {
    setBulkDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const removeLabelDocument = (docId: string) => {
    setLabelDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new project
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          
          <div className="mt-6">
            <Label className="mb-2 block">Documents</Label>
            <EnhancedUploadSection
              bulkFiles={bulkFiles}
              setBulkFiles={setBulkFiles}
              bulkDocuments={bulkDocuments}
              setBulkDocuments={setBulkDocuments}
              labelFiles={labelFiles}
              setLabelFiles={setLabelFiles}
              labelDocuments={labelDocuments}
              setLabelDocuments={setLabelDocuments}
              isLoading={isLoading}
              selectedLabels={selectedLabels}
              setSelectedLabels={setSelectedLabels}
              handleBulkUpload={handleBulkUpload}
              handleLabelUpload={handleLabelUpload}
              handleProcessFiles={handleProcessFiles}
              removeBulkDocument={removeBulkDocument}
              removeLabelDocument={removeLabelDocument}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateProject}
            disabled={isLoading || !projectName.trim() || 
              (uploadType === "bulk" ? bulkDocuments.length === 0 : labelDocuments.length === 0)}
          >
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
