
import React, { useState, useEffect } from "react";
import { Task, Figure } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  const [isFiguresSectionOpen, setIsFiguresSectionOpen] = useState(true);

  useEffect(() => {
    setEditedTask(task ? { ...task } : null);
  }, [task]);

  if (!isOpen || !editedTask) {
    return null;
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask({ ...editedTask, title: e.target.value });
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

  const handleSave = () => {
    onSave(editedTask);
    toast.success("Task updated successfully");
    onClose();
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-1/3 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
      <div className="h-full bg-white shadow-xl border-l flex flex-col">
        <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Task</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Task Title</label>
              <Input
                value={editedTask.title}
                onChange={handleTitleChange}
              />
            </div>
            
            <Collapsible 
              open={isFiguresSectionOpen} 
              onOpenChange={setIsFiguresSectionOpen}
              className="w-full border rounded-md"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 border-b">
                <h3 className="text-md font-medium">Figures ({editedTask.figures.length})</h3>
                {isFiguresSectionOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              
              <CollapsibleContent className="p-4">
                <div className="space-y-4">
                  {editedTask.figures.map((figure, index) => (
                    <div key={figure.id} className="border rounded-md p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="overflow-hidden rounded-md flex-grow">
                          <AspectRatio ratio={16/9}>
                            <img
                              src={figure.imageUrl}
                              alt={figure.title}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </AspectRatio>
                        </div>
                        <Button
                          variant="ghost" 
                          size="sm"
                          className="text-slate-400 hover:text-red-500 ml-2"
                          onClick={() => handleDeleteFigure(figure.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Figure Title</label>
                        <Input
                          value={figure.title}
                          onChange={(e) => handleFigureTitleChange(figure.id, e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Figure Description</label>
                        <Textarea
                          value={figure.description}
                          onChange={(e) => handleFigureDescriptionChange(figure.id, e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
        
        <div className="p-4 border-t bg-slate-50">
          <Button onClick={handleSave} className="w-full">Save Changes</Button>
        </div>
      </div>
      
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]" 
        onClick={onClose}
      ></div>
    </div>
  );
};

export default TaskEditorSidebar;
