
import React, { useState, useEffect } from "react";
import { Task } from "@/types";
import TaskEditorHeader from "./TaskEditorHeader";
import TaskEditorFooter from "./TaskEditorFooter";
import TaskEditorForm from "./TaskEditorForm";
import TaskEditorFiguresSection from "./TaskEditorFiguresSection";
import { toast } from "@/hooks/use-toast";

interface TaskEditorSidebarProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
  onDeleteFigure?: (taskId: string, figureId: string) => void;
}

const TaskEditorSidebar: React.FC<TaskEditorSidebarProps> = ({
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

  if (!isOpen || !editedTask) {
    return null;
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask({ ...editedTask, title: e.target.value });
  };
  
  const handleColumnChange = (value: string) => {
    setEditedTask({ 
      ...editedTask, 
      column: value as "design" | "analyse" | "dev" | "testing" 
    });
  };

  const handleFigureTitleChange = (figureId: string, value: string) => {
    setEditedTask({
      ...editedTask,
      figures: editedTask.figures.map((figure) =>
        figure.id === figureId ? { ...figure, title: value } : figure
      ),
    });
  };

  const handleFigureDescriptionChange = (figureId: string, value: string) => {
    setEditedTask({
      ...editedTask,
      figures: editedTask.figures.map((figure) =>
        figure.id === figureId ? { ...figure, description: value } : figure
      ),
    });
  };

  const handleDeleteFigure = (figureId: string) => {
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

  const handleReorderFigures = (reorderedFigures: Task["figures"]) => {
    setEditedTask({
      ...editedTask,
      figures: reorderedFigures
    });
  };

  const handleSave = () => {
    onSave(editedTask);
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully"
    });
    onClose();
  };

  const toggleFigureCollapse = (figureId: string) => {
    setCollapsedFigures(prev => ({
      ...prev,
      [figureId]: !prev[figureId]
    }));
  };

  // Column colors 
  const columnColors = {
    design: "bg-gradient-to-r from-rose-400 to-rose-500",
    analyse: "bg-gradient-to-r from-blue-400 to-blue-500",
    dev: "bg-gradient-to-r from-emerald-400 to-emerald-500",
    testing: "bg-gradient-to-r from-amber-400 to-amber-500"
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-1/3 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
      <div className="h-full bg-white shadow-xl border-l flex flex-col">
        <TaskEditorHeader 
          title="Edit Task" 
          colorClass={columnColors[editedTask.column]} 
          onClose={onClose} 
        />
        
        <div className="flex-grow overflow-y-auto p-6">
          <div className="space-y-6">
            <TaskEditorForm 
              task={editedTask}
              onTitleChange={handleTitleChange}
              onColumnChange={handleColumnChange}
            />
            
            <TaskEditorFiguresSection
              figures={editedTask.figures}
              collapsedFigures={collapsedFigures}
              onToggleFigureCollapse={toggleFigureCollapse}
              onFigureTitleChange={handleFigureTitleChange}
              onFigureDescriptionChange={handleFigureDescriptionChange}
              onDeleteFigure={handleDeleteFigure}
              onReorderFigures={handleReorderFigures}
            />
          </div>
        </div>
        
        <TaskEditorFooter onSave={handleSave} />
      </div>
      
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]" 
        onClick={onClose}
      ></div>
    </div>
  );
};

export default TaskEditorSidebar;
