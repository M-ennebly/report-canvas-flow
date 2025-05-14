
import React, { useState } from "react";
import { Task } from "@/types";
import Column from "./Column";
import ListView from "./ListView";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, List } from "lucide-react";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onTaskMove: (taskId: string, sourceColumn: string, targetColumn: string) => void;
  onTaskDelete: (taskId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskClick,
  onTaskMove,
  onTaskDelete,
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [sourceColumn, setSourceColumn] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <h2 className="text-xl font-semibold">Project Tasks & Figures</h2>
        
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "kanban" | "list")} className="mt-2 md:mt-0">
          <TabsList>
            <TabsTrigger value="kanban">
              <Kanban className="h-4 w-4 mr-1" /> Kanban
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-1" /> List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              title={column.title}
              tasks={getTasksByColumn(column.id)}
              columnId={column.id}
              onTaskClick={onTaskClick}
              onTaskDelete={onTaskDelete}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}
      
      {viewMode === "list" && (
        <ListView
          tasks={tasks}
          columns={columns}
          onTaskClick={onTaskClick}
          onTaskDelete={onTaskDelete}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
