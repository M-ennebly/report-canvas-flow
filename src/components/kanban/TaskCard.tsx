
import React from "react";
import { Task } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onDragStart }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
    >
      <CardContent className="p-3">
        <div className="mb-2 border-b pb-1">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Task</span>
          <h4 className="font-medium text-slate-800">{task.title}</h4>
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
              <div key={figure.id} className="aspect-video relative rounded bg-slate-100 overflow-hidden">
                <img
                  src={figure.imageUrl}
                  alt={figure.title}
                  className="w-full h-full object-cover"
                />
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
