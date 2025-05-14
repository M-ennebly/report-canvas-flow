
import React, { useState, useEffect } from "react";
import { Document, Task } from "@/types";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import DocumentPanel from "@/components/document/DocumentPanel";
import TaskEditorSidebar from "@/components/task/TaskEditorSidebar";
import MobileDocumentPanel from "./MobileDocumentPanel";
import MobileDocumentToggle from "./MobileDocumentToggle";
import { useProjectState } from "@/hooks/useProjectState";

interface WorkspaceContentProps {
  labelId?: string;
  initialDocuments?: Document[];
  selectedLabels?: string[];
}

const WorkspaceContent: React.FC<WorkspaceContentProps> = ({ 
  labelId,
  initialDocuments = [],
  selectedLabels = []
}) => {
  const {
    project,
    handleTaskMove,
    handleSaveTask,
    handleDescriptionChange,
    handleLinkedReportChange,
    handleDocumentUpload,
    handleDocumentDelete
  } = useProjectState(labelId, initialDocuments, selectedLabels);

  // State for sidebar visibility on mobile
  const [isDocPanelOpen, setIsDocPanelOpen] = useState(true);
  
  // Selected task for editing
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Initialize with documents from session storage if available
  useEffect(() => {
    const storedDocuments = sessionStorage.getItem('uploadedDocuments');
    if (storedDocuments) {
      try {
        const documents = JSON.parse(storedDocuments);
        if (documents && documents.length > 0) {
          handleDocumentUpload(documents);
        }
        
        // Clear session storage after processing
        sessionStorage.removeItem('uploadedDocuments');
      } catch (error) {
        console.error("Error parsing uploaded documents:", error);
      }
    }
  }, []);

  const handleTaskClick = (taskId: string) => {
    const task = project.tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsEditorOpen(true);
    }
  };

  return (
    <div className="flex-grow flex overflow-hidden">
      {/* Left Document Panel */}
      <div className="w-80 lg:w-96 hidden md:block bg-white border-r overflow-y-auto">
        <DocumentPanel
          project={project}
          onDescriptionChange={handleDescriptionChange}
          onLinkedReportChange={handleLinkedReportChange}
          onDocumentUpload={handleDocumentUpload}
          onDocumentDelete={handleDocumentDelete}
        />
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <KanbanBoard 
          tasks={project.tasks} 
          onTaskClick={handleTaskClick}
          onTaskMove={handleTaskMove}
        />
      </div>

      {/* Mobile Document Panel for small screens */}
      <MobileDocumentPanel
        isOpen={isDocPanelOpen}
        project={project}
        onClose={() => setIsDocPanelOpen(false)}
        onDescriptionChange={handleDescriptionChange}
        onLinkedReportChange={handleLinkedReportChange}
        onDocumentUpload={handleDocumentUpload}
        onDocumentDelete={handleDocumentDelete}
      />

      {/* Document Panel Toggle for Mobile */}
      <MobileDocumentToggle onToggle={() => setIsDocPanelOpen(true)} />

      {/* Task Editor Sidebar (on the right) */}
      <TaskEditorSidebar
        task={selectedTask}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default WorkspaceContent;
