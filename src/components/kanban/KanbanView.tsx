
import React from "react";
import { Task } from "@/types";
import Column from "./Column";

interface KanbanViewProps {
  tasks: Task[];
  columns: { id: "design" | "analyse" | "dev" | "testing"; title: string }[];
  onDragStart: (e: React.DragEvent, taskId: string, sourceColumnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetColumnId: string) => void;
  onTaskClick: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}

const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  columns,
  onDragStart,
  onDragOver,
  onDrop,
  onTaskClick,
  onTaskDelete,
}) => {
  const getTasksByColumn = (columnId: string) => {
    return tasks.filter(task => task.column === columnId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column) => (
        <Column
          key={column.id}
          title={column.title}
          tasks={getTasksByColumn(column.id)}
          columnId={column.id}
          onTaskClick={onTaskClick}
          onTaskDelete={onTaskDelete}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
};

export default KanbanView;
