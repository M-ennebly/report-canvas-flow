
import React, { createContext, useContext, useState, useEffect } from "react";
import { Task, Figure } from "@/types";
import { toast } from "@/hooks/use-toast";

interface TaskEditorSidebarContextProps {
  task: Task | null;
  editedTask: Task | null;
  collapsedFigures: Record<string, boolean>;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleColumnChange: (value: string) => void;
  handleFigureTitleChange: (figureId: string, value: string) => void;
  handleFigureDescriptionChange: (figureId: string, value: string) => void;
  handleDeleteFigure: (figureId: string) => void;
  handleReorderFigures: (reorderedFigures: Figure[]) => void;
  toggleFigureCollapse: (figureId: string) => void;
  handleSave: () => void;
  onClose: () => void;
}

const TaskEditorSidebarContext = createContext<TaskEditorSidebarContextProps | undefined>(undefined);

interface TaskEditorSidebarProviderProps {
  children: React.ReactNode;
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
  onDeleteFigure?: (taskId: string, figureId: string) => void;
}

export const TaskEditorSidebarProvider: React.FC<TaskEditorSidebarProviderProps> = ({
  children,
  task,
  isOpen,
  onClose,
  onSave,
  onDeleteFigure,
}) => {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [collapsedFigures, setCollapsedFigures] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setEditedTask(task ? { ...task } : null);
    
    // Initialize all figures to collapsed state by default
    if (task && task.figures.length > 0) {
      const initialCollapsedState = task.figures.reduce((acc, figure) => {
        acc[figure.id] = true; // Start with all figures collapsed
        return acc;
      }, {} as Record<string, boolean>);
      setCollapsedFigures(initialCollapsedState);
    }
  }, [task]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, title: e.target.value });
    }
  };
  
  const handleColumnChange = (value: string) => {
    if (editedTask) {
      setEditedTask({ 
        ...editedTask, 
        column: value as "design" | "analyse" | "dev" | "testing" 
      });
    }
  };

  const handleFigureTitleChange = (figureId: string, value: string) => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        figures: editedTask.figures.map((figure) =>
          figure.id === figureId ? { ...figure, title: value } : figure
        ),
      });
    }
  };

  const handleFigureDescriptionChange = (figureId: string, value: string) => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        figures: editedTask.figures.map((figure) =>
          figure.id === figureId ? { ...figure, description: value } : figure
        ),
      });
    }
  };

  const handleDeleteFigure = (figureId: string) => {
    if (!editedTask) return;
    
    if (onDeleteFigure && task) {
      onDeleteFigure(task.id, figureId);
      onClose();
    } else {
      // If no external delete handler, just update local state
      setEditedTask({
        ...editedTask,
        figures: editedTask.figures.filter(figure => figure.id !== figureId)
      });
    }
  };

  const handleReorderFigures = (reorderedFigures: Figure[]) => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        figures: reorderedFigures
      });
    }
  };

  const toggleFigureCollapse = (figureId: string) => {
    setCollapsedFigures(prev => ({
      ...prev,
      [figureId]: !prev[figureId]
    }));
  };

  const handleSave = () => {
    if (editedTask) {
      onSave(editedTask);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully"
      });
      onClose();
    }
  };

  const value = {
    task,
    editedTask,
    collapsedFigures,
    handleTitleChange,
    handleColumnChange,
    handleFigureTitleChange,
    handleFigureDescriptionChange,
    handleDeleteFigure,
    handleReorderFigures,
    toggleFigureCollapse,
    handleSave,
    onClose
  };

  return (
    <TaskEditorSidebarContext.Provider value={value}>
      {children}
    </TaskEditorSidebarContext.Provider>
  );
};

export const useTaskEditorSidebar = (): TaskEditorSidebarContextProps => {
  const context = useContext(TaskEditorSidebarContext);
  if (context === undefined) {
    throw new Error("useTaskEditorSidebar must be used within a TaskEditorSidebarProvider");
  }
  return context;
};
