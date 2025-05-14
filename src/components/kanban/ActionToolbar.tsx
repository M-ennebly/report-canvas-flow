
import React, { useState } from "react";
import SelectionToolbar from "./shared/SelectionToolbar";
import ConfirmDialog from "@/components/ui/confirm-dialog";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  if (!showActionToolbar || viewMode === "tree") return null;
  
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onBulkDeleteTasks();
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <>
      <SelectionToolbar
        selectedItems={selectedItems}
        columns={columns}
        onMoveToColumn={onBulkMoveTasksToColumn}
        onDelete={handleDeleteClick}
        onClearSelection={onCancelSelection}
        position="fixed"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Selected Tasks"
        description={`Are you sure you want to delete ${selectedItems.tasks.length} selected task${selectedItems.tasks.length === 1 ? '' : 's'}? This action cannot be undone.`}
      />
    </>
  );
};

export default ActionToolbar;
