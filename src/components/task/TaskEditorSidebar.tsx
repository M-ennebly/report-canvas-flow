
import React, { useState, useEffect } from "react";
import { Task, Figure } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Trash2, X, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  // Column display names
  const columnNames = {
    design: "Design",
    analyse: "Analysis",
    dev: "Development",
    testing: "Testing"
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
        <div className={`p-4 ${columnColors[editedTask.column]} text-white flex items-center justify-between`}>
          <h2 className="text-xl font-semibold flex items-center">Edit Task</h2>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Task Title</label>
              <Input
                value={editedTask.title}
                onChange={handleTitleChange}
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Enter task title"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Task Column/Label</label>
              <Select
                value={editedTask.column}
                onValueChange={handleColumnChange}
              >
                <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design" className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-rose-500 mr-2"></span>
                    {columnNames.design}
                  </SelectItem>
                  <SelectItem value="analyse" className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    {columnNames.analyse}
                  </SelectItem>
                  <SelectItem value="dev" className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                    {columnNames.dev}
                  </SelectItem>
                  <SelectItem value="testing" className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                    {columnNames.testing}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="rounded-lg bg-gray-50 shadow-sm border overflow-hidden">
              <div className="flex items-center justify-between w-full px-4 py-3 bg-gray-100">
                <h3 className="text-md font-medium flex items-center">
                  <span className="mr-2">Figures</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {editedTask.figures.length}
                  </span>
                </h3>
              </div>
              
              <div className="p-4 space-y-4">
                {editedTask.figures.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No figures attached to this task
                  </div>
                ) : (
                  editedTask.figures.map((figure, index) => (
                    <Collapsible 
                      key={figure.id} 
                      open={!collapsedFigures[figure.id]}
                      onOpenChange={() => toggleFigureCollapse(figure.id)}
                      className="border rounded-lg overflow-hidden transition-all duration-200 hover:border-blue-300"
                    >
                      <CollapsibleTrigger className="w-full group">
                        <div className="p-3 bg-white border-b flex justify-between items-center hover:bg-blue-50 transition-colors duration-200">
                          <h4 className="text-sm font-medium text-gray-800">
                            {figure.title || `Figure ${index + 1}`}
                          </h4>
                          <div className="flex items-center">
                            <Button
                              variant="ghost" 
                              size="sm"
                              className="text-gray-400 hover:text-red-500 p-1 h-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFigure(figure.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {collapsedFigures[figure.id] ? (
                              <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
                            ) : (
                              <ChevronUp className="h-4 w-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="p-4 space-y-4 bg-white">
                          <div className="overflow-hidden rounded-md flex-grow">
                            <AspectRatio ratio={16/9}>
                              <img
                                src={figure.imageUrl}
                                alt={figure.title}
                                className="w-full h-full object-cover rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
                              />
                            </AspectRatio>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Figure Title</label>
                            <Input
                              value={figure.title}
                              onChange={(e) => handleFigureTitleChange(figure.id, e.target.value)}
                              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter figure title"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Figure Description</label>
                            <Textarea
                              value={figure.description}
                              onChange={(e) => handleFigureDescriptionChange(figure.id, e.target.value)}
                              rows={3}
                              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter figure description"
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
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
