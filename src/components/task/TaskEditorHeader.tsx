
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTaskEditorSidebar } from "./TaskEditorSidebarContext";

interface TaskEditorHeaderProps {
  title: string;
  colorClass: string;
}

const TaskEditorHeader: React.FC<TaskEditorHeaderProps> = ({
  title,
  colorClass
}) => {
  const { onClose } = useTaskEditorSidebar();
  
  return (
    <div className={`p-4 ${colorClass} text-white flex items-center justify-between`}>
      <h2 className="text-xl font-semibold flex items-center">{title}</h2>
      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default TaskEditorHeader;
