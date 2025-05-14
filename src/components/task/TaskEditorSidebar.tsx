
import React from "react";
import { Task } from "@/types";
import TaskEditorHeader from "./TaskEditorHeader";
import TaskEditorFooter from "./TaskEditorFooter";
import TaskEditorForm from "./TaskEditorForm";
import TaskEditorFiguresSection from "./TaskEditorFiguresSection";
import { TaskEditorSidebarProvider } from "./TaskEditorSidebarContext";

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
  if (!isOpen || !task) {
    return null;
  }

  // Column colors 
  const columnColors = {
    design: "bg-gradient-to-r from-rose-400 to-rose-500",
    analyse: "bg-gradient-to-r from-blue-400 to-blue-500",
    dev: "bg-gradient-to-r from-emerald-400 to-emerald-500",
    testing: "bg-gradient-to-r from-amber-400 to-amber-500"
  };

  return (
    <TaskEditorSidebarProvider
      task={task}
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      onDeleteFigure={onDeleteFigure}
    >
      <div className={`fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-1/3 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="h-full bg-white shadow-xl border-l flex flex-col">
          <TaskEditorHeader 
            title="Edit Task" 
            colorClass={columnColors[task.column]} 
          />
          
          <div className="flex-grow overflow-y-auto p-6">
            <div className="space-y-6">
              <TaskEditorForm />
              
              <TaskEditorFiguresSection />
            </div>
          </div>
          
          <TaskEditorFooter />
        </div>
        
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]" 
          onClick={onClose}
        ></div>
      </div>
    </TaskEditorSidebarProvider>
  );
};

export default TaskEditorSidebar;
