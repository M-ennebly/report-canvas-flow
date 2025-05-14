
import React, { useState } from "react";
import { Task } from "@/types";
import KanbanView from "./KanbanView";
import ListView from "./ListView";
import TreeView from "./TreeView";
import ViewSwitcher from "./ViewSwitcher";
import ActionToolbar from "./ActionToolbar";

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
  const [viewMode, setViewMode] = useState<"kanban" | "list" | "tree">("kanban");
  
  // State for multi-selection
  const [selectedItems, setSelectedItems] = useState<{
    tasks: string[],
    figures: {taskId: string, figureId: string}[]
  }>({
    tasks: [],
    figures: []
  });
  
  // State for showing action toolbar
  const [showActionToolbar, setShowActionToolbar] = useState(false);

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

  // Handle selection of items (tasks or figures)
  const handleSelectItems = (items: {tasks: string[], figures: {taskId: string, figureId: string}[]}) => {
    setSelectedItems(items);
    setShowActionToolbar(items.tasks.length > 0 || items.figures.length > 0);
  };
  
  // Handle bulk move of tasks to a different column
  const handleBulkMoveTasksToColumn = (targetColumn: string) => {
    if (selectedItems.tasks.length > 0) {
      selectedItems.tasks.forEach(taskId => {
        const task = tasks.find(t => t.id === taskId);
        if (task && task.column !== targetColumn) {
          onTaskMove(taskId, task.column, targetColumn);
        }
      });
      clearSelection();
    }
  };
  
  // Handle bulk delete of tasks
  const handleBulkDeleteTasks = () => {
    if (selectedItems.tasks.length > 0) {
      selectedItems.tasks.forEach(taskId => {
        onTaskDelete(taskId);
      });
      clearSelection();
    }
  };

  // Clear selection and hide toolbar
  const clearSelection = () => {
    setSelectedItems({tasks: [], figures: []});
    setShowActionToolbar(false);
  };

  // Handle view mode changes
  const handleViewModeChange = (mode: "kanban" | "list" | "tree") => {
    setViewMode(mode);
    // Clear any selections when changing views
    clearSelection();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <h2 className="text-xl font-semibold">Project Tasks & Figures</h2>
        <ViewSwitcher viewMode={viewMode} onViewChange={handleViewModeChange} />
      </div>

      {viewMode === "kanban" && (
        <KanbanView
          tasks={tasks}
          columns={columns}
          onTaskClick={onTaskClick}
          onTaskDelete={onTaskDelete}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      )}
      
      {viewMode === "list" && (
        <ListView
          tasks={tasks}
          columns={columns}
          onTaskClick={onTaskClick}
          onTaskDelete={onTaskDelete}
        />
      )}
      
      {viewMode === "tree" && (
        <TreeView
          tasks={tasks}
          columns={columns}
          onTaskClick={onTaskClick}
          onSelectItems={handleSelectItems}
        />
      )}
      
      <ActionToolbar
        selectedItems={selectedItems}
        showActionToolbar={showActionToolbar}
        viewMode={viewMode}
        columns={columns}
        onBulkMoveTasksToColumn={handleBulkMoveTasksToColumn}
        onBulkDeleteTasks={handleBulkDeleteTasks}
        onCancelSelection={clearSelection}
      />
    </div>
  );
};

export default KanbanBoard;
