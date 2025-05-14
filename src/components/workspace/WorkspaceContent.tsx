
import React, { useState, useEffect } from "react";
import { Document, Task, Project } from "@/types";
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
  onProjectUpdate?: (project: Project) => void;
}

const WorkspaceContent: React.FC<WorkspaceContentProps> = ({ 
  labelId,
  initialDocuments = [],
  selectedLabels = [],
  onProjectUpdate
}) => {
  const {
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
  } = useProjectState(labelId, initialDocuments, selectedLabels);

  // State for sidebar visibility on mobile
  const [isDocPanelOpen, setIsDocPanelOpen] = useState(true);
  
  // Selected task for editing
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Provide project state back to parent component
  useEffect(() => {
    if (onProjectUpdate) {
      onProjectUpdate(project);
    }
  }, [project, onProjectUpdate]);

  const handleTaskClick = (taskId: string) => {
    const task = project.tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsEditorOpen(true);
    }
  };

  return (
    <div className="flex-grow flex overflow-hidden">
      {/* Left Document Panel - using flex-none to avoid it taking space when collapsed */}
      <div className="hidden md:flex">
        <DocumentPanel
          project={project}
          onDescriptionChange={handleDescriptionChange}
          onLinkedReportChange={handleLinkedReportChange}
          onDocumentUpload={handleDocumentUpload}
          onDocumentDelete={handleDocumentDelete}
          onExtractFigures={handleExtractFigures}
        />
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <KanbanBoard 
          tasks={project.tasks} 
          onTaskClick={handleTaskClick}
          onTaskMove={handleTaskMove}
          onTaskDelete={handleDeleteTask}
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
        onExtractFigures={handleExtractFigures}
      />

      {/* Document Panel Toggle for Mobile */}
      <MobileDocumentToggle onToggle={() => setIsDocPanelOpen(true)} />

      {/* Task Editor Sidebar (on the right) */}
      <TaskEditorSidebar
        task={selectedTask}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveTask}
        onDeleteFigure={handleDeleteFigure}
      />
    </div>
  );
};

export default WorkspaceContent;
