
import React from "react";
import SelectionToolbar from "../shared/SelectionToolbar";

interface TreeViewToolbarProps {
  hasSelectedItems: boolean;
  selectedItems: {
    tasks: string[];
    figures: {taskId: string; figureId: string}[];
  };
  columns: { id: string; title: string }[];
  treeViewWidth: number;
  onClearSelection: () => void;
}

const TreeViewToolbar: React.FC<TreeViewToolbarProps> = ({
  hasSelectedItems,
  selectedItems,
  columns,
  treeViewWidth,
  onClearSelection
}) => {
  if (!hasSelectedItems) return null;
  
  return (
    <SelectionToolbar
      selectedItems={selectedItems}
      columns={columns}
      containerWidth={treeViewWidth}
      onClearSelection={onClearSelection}
      position="absolute"
    />
  );
};

export default TreeViewToolbar;
