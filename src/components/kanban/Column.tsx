
import React from "react";
import { Task } from "@/types";
import TaskCard from "./TaskCard";

interface ColumnProps {
  title: string;
  tasks: Task[];
  columnId: "design" | "analyse" | "dev" | "testing";
  onTaskClick: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string, sourceColumn: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  title,
  tasks,
  columnId,
  onTaskClick,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const columnColors = {
    design: "border-kanban-design",
    analyse: "border-kanban-analyse",
    dev: "border-kanban-dev",
    testing: "border-kanban-testing"
  };

  const headerColors = {
    design: "bg-kanban-design text-white",
    analyse: "bg-kanban-analyse text-white",
    dev: "bg-kanban-dev text-white",
    testing: "bg-kanban-testing text-white"
  };

  return (
    <div 
      className={`flex flex-col border ${columnColors[columnId]} rounded-lg h-full`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, columnId)}
    >
      <div className={`p-3 ${headerColors[columnId]} rounded-t-lg font-semibold`}>
        <div className="flex justify-between items-center">
          <h3>{title}</h3>
          <div className="bg-white bg-opacity-30 px-2 py-0.5 rounded text-sm">
            {tasks.length}
          </div>
        </div>
      </div>
      <div className="flex-grow p-2 bg-slate-50 overflow-y-auto rounded-b-lg min-h-[calc(100vh-220px)]">
        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task.id)}
                onDragStart={(e) => onDragStart(e, task.id, columnId)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-24 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
