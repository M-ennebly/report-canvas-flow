
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useTaskEditorSidebar } from "./TaskEditorSidebarContext";

const TaskEditorFooter: React.FC = () => {
  const { handleSave } = useTaskEditorSidebar();
  
  return (
    <div className="p-4 border-t bg-gray-50">
      <Button onClick={handleSave} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
        <Save className="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
};

export default TaskEditorFooter;
