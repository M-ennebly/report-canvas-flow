
import React, { useState } from "react";
import { Task } from "@/types";
import Column from "./Column";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onTaskMove: (taskId: string, sourceColumn: string, targetColumn: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskClick,
  onTaskMove,
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [sourceColumn, setSourceColumn] = useState<string | null>(null);

  const columns = [
    { id: "design" as const, title: "Design" },
    { id: "analyse" as const, title: "Analyse" },
    { id: "dev" as const, title: "Dev" },
    { id: "testing" as const, title: "Testing" }
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string, sourceColumnId: string) => {
    setDraggedTaskId(taskId);
    setSourceColumn(sourceColumnId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    if (draggedTaskId && sourceColumn && sourceColumn !== targetColumnId) {
      onTaskMove(draggedTaskId, sourceColumn, targetColumnId);
    }
    
    setDraggedTaskId(null);
    setSourceColumn(null);
  };

  const getTasksByColumn = (columnId: string) => {
    return tasks.filter(task => task.column === columnId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      {columns.map((column) => (
        <Column
          key={column.id}
          title={column.title}
          tasks={getTasksByColumn(column.id)}
          columnId={column.id}
          onTaskClick={onTaskClick}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
