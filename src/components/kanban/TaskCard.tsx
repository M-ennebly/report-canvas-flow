
import React from "react";
import { Task } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDelete?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onDragStart, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (onDelete) onDelete();
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
    >
      <CardContent className="p-3">
        <div className="mb-2 border-b pb-1 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">Task</span>
            <h4 className="font-medium text-slate-800">{task.title}</h4>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-slate-400 hover:text-red-500"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete task</span>
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Figures</span>
            <span className="text-xs font-medium bg-slate-100 px-2 py-0.5 rounded-full">
              {task.figures.length}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {task.figures.slice(0, 4).map((figure) => (
              <div key={figure.id} className="relative rounded overflow-hidden bg-slate-100">
                <AspectRatio ratio={16/9}>
                  <img
                    src={figure.imageUrl}
                    alt={figure.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-[10px] p-1 truncate">
                    {figure.title}
                  </div>
                </AspectRatio>
              </div>
            ))}
          </div>
          {task.figures.length > 4 && (
            <div className="text-xs text-slate-500 mt-1 text-right">
              +{task.figures.length - 4} more figures
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
