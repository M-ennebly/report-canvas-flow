
import React, { useState } from "react";
import { Task } from "@/types";
import Column from "./Column";
import ListView from "./ListView";
import TreeView from "./TreeView";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, List, FolderTree } from "lucide-react";

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

  const getTasksByColumn = (columnId: string) => {
    return tasks.filter(task => task.column === columnId);
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
      setSelectedItems({tasks: [], figures: []});
      setShowActionToolbar(false);
    }
  };
  
  // Handle bulk delete of tasks
  const handleBulkDeleteTasks = () => {
    if (selectedItems.tasks.length > 0) {
      selectedItems.tasks.forEach(taskId => {
        onTaskDelete(taskId);
      });
      setSelectedItems({tasks: [], figures: []});
      setShowActionToolbar(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <h2 className="text-xl font-semibold">Project Tasks & Figures</h2>
        
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "kanban" | "list" | "tree")} className="mt-2 md:mt-0">
          <TabsList>
            <TabsTrigger value="kanban">
              <Kanban className="h-4 w-4 mr-1" /> Kanban
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-1" /> List
            </TabsTrigger>
            <TabsTrigger value="tree">
              <FolderTree className="h-4 w-4 mr-1" /> Tree
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
      
      {viewMode === "tree" && (
        <TreeView
          tasks={tasks}
          columns={columns}
          onTaskClick={onTaskClick}
          onSelectItems={handleSelectItems}
        />
      )}
      
      {/* Action Toolbar - Only show in Kanban and List views */}
      {showActionToolbar && viewMode !== "tree" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 flex items-center justify-between z-50">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-3">
              {selectedItems.tasks.length > 0 ? 
                `${selectedItems.tasks.length} task(s) selected` : 
                `${selectedItems.figures.length} figure(s) selected`
              }
            </span>
          </div>
          <div className="flex space-x-2">
            {selectedItems.tasks.length > 0 && (
              <>
                {columns.map((column) => (
                  <Button 
                    key={column.id}
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkMoveTasksToColumn(column.id)}
                  >
                    Move to {column.title}
                  </Button>
                ))}
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleBulkDeleteTasks}
                >
                  Delete
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedItems({tasks: [], figures: []});
                setShowActionToolbar(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
