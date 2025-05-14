
import React from "react";
import { Button } from "@/components/ui/button";

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
    <div 
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white border shadow-lg p-3 rounded-lg z-50"
      style={{ 
        maxWidth: treeViewWidth - 30, 
        width: 'auto' 
      }}
    >
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-xs font-medium mr-1 whitespace-nowrap">
          {selectedItems.tasks.length > 0 ? 
            `${selectedItems.tasks.length} task(s) selected` : 
            `${selectedItems.figures.length} figure(s) selected`
          }
        </span>
        
        {selectedItems.tasks.length > 0 && (
          <>
            {columns.map((column) => (
              <Button 
                key={column.id}
                variant="outline" 
                size="sm"
                className="text-xs px-2 py-1 h-auto"
              >
                Move to {column.title}
              </Button>
            ))}
            <Button 
              variant="destructive" 
              size="sm"
              className="text-xs px-2 py-1 h-auto"
            >
              Delete
            </Button>
          </>
        )}
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs px-2 py-1 h-auto"
          onClick={onClearSelection}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default TreeViewToolbar;
