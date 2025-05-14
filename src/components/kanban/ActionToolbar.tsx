
import React from "react";
import { Button } from "@/components/ui/button";

interface ActionToolbarProps {
  selectedItems: {
    tasks: string[];
    figures: {taskId: string; figureId: string}[];
  };
  showActionToolbar: boolean;
  viewMode: "kanban" | "list" | "tree";
  columns: { id: string; title: string }[];
  onBulkMoveTasksToColumn: (targetColumn: string) => void;
  onBulkDeleteTasks: () => void;
  onCancelSelection: () => void;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({
  selectedItems,
  showActionToolbar,
  viewMode,
  columns,
  onBulkMoveTasksToColumn,
  onBulkDeleteTasks,
  onCancelSelection,
}) => {
  if (!showActionToolbar || viewMode === "tree") return null;
  
  return (
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
                onClick={() => onBulkMoveTasksToColumn(column.id)}
              >
                Move to {column.title}
              </Button>
            ))}
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onBulkDeleteTasks}
            >
              Delete
            </Button>
          </>
        )}
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCancelSelection}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ActionToolbar;
