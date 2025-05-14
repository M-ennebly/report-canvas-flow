
import React from "react";
import SelectionToolbar from "./shared/SelectionToolbar";

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
    <SelectionToolbar
      selectedItems={selectedItems}
      columns={columns}
      onMoveToColumn={onBulkMoveTasksToColumn}
      onDelete={onBulkDeleteTasks}
      onClearSelection={onCancelSelection}
      position="fixed"
    />
  );
};

export default ActionToolbar;
