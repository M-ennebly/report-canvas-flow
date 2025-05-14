
import React from "react";
import { Figure } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Trash2, GripVertical } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";

interface TaskEditorFigureProps {
  figure: Figure;
  index: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDelete: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

const TaskEditorFigure: React.FC<TaskEditorFigureProps> = ({
  figure,
  index,
  isCollapsed,
  onToggleCollapse,
  onTitleChange,
  onDescriptionChange,
  onDelete,
  dragHandleProps
}) => {
  return (
    <Collapsible 
      open={!isCollapsed}
      onOpenChange={onToggleCollapse}
      className="border rounded-lg overflow-hidden transition-all duration-200 hover:border-blue-300"
    >
      <CollapsibleTrigger className="w-full group">
        <div className="p-3 bg-white border-b flex justify-between items-center hover:bg-blue-50 transition-colors duration-200">
          <div className="flex items-center flex-1">
            <div {...dragHandleProps} className="cursor-grab p-1 mr-2 hover:bg-gray-100 rounded">
              <GripVertical className="h-4 w-4 text-gray-500" />
            </div>
            <h4 className="text-sm font-medium text-gray-800">
              {figure.title || `Figure ${index + 1}`}
            </h4>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost" 
              size="sm"
              className="text-gray-400 hover:text-red-500 p-1 h-auto"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {isCollapsed ? (
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
              onChange={(e) => onTitleChange(e.target.value)}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter figure title"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Figure Description</label>
            <Textarea
              value={figure.description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={3}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter figure description"
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TaskEditorFigure;
