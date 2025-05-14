
import React from "react";
import { Button } from "@/components/ui/button";

interface SelectionToolbarProps {
  selectedItems: {
    tasks: string[];
    figures: {taskId: string; figureId: string}[];
  };
  columns: { id: string; title: string }[];
  containerWidth?: number;
  onMoveToColumn?: (columnId: string) => void;
  onDelete?: () => void;
  onClearSelection: () => void;
  position?: "fixed" | "absolute";
  className?: string;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  selectedItems,
  columns,
  containerWidth,
  onMoveToColumn,
  onDelete,
  onClearSelection,
  position = "absolute",
  className = "",
}) => {
  const hasSelectedItems = selectedItems.tasks.length > 0 || selectedItems.figures.length > 0;
  
  if (!hasSelectedItems) return null;
  
  // Determine toolbar positioning styles
  const positionStyles = position === "fixed" 
    ? {
        position: "fixed" as const,
        bottom: "0",
        left: "0",
        right: "0",
        width: "100%",
      }
    : {
        position: "absolute" as const,
        bottom: "1rem", // 4 in tailwind
        left: "50%",
        transform: "translateX(-50%)",
        width: containerWidth ? `${Math.min(containerWidth - 30, 800)}px` : "auto",
        maxWidth: "95%",
      };
    
  // Determine container class based on position
  const containerClass = position === "fixed"
    ? "bg-white border-t shadow-lg p-4 flex items-center justify-between z-50"
    : "bg-white border shadow-lg p-3 rounded-lg z-50";
  
  return (
    <div 
      className={`${containerClass} ${className}`}
      style={positionStyles}
    >
      <div className={position === "fixed" ? "flex items-center" : "flex flex-wrap gap-2 justify-center"}>
        {position === "fixed" && (
          <span className="text-sm font-medium mr-3">
            {selectedItems.tasks.length > 0 ? 
              `${selectedItems.tasks.length} task(s) selected` : 
              `${selectedItems.figures.length} figure(s) selected`
            }
          </span>
        )}
        
        {position !== "fixed" && (
          <span className="text-xs font-medium mr-1 whitespace-nowrap">
            {selectedItems.tasks.length > 0 ? 
              `${selectedItems.tasks.length} task(s) selected` : 
              `${selectedItems.figures.length} figure(s) selected`
            }
          </span>
        )}
        
        {selectedItems.tasks.length > 0 && onMoveToColumn && (
          <>
            {columns.map((column) => (
              <Button 
                key={column.id}
                variant="outline" 
                size={position === "fixed" ? "sm" : "sm"}
                className={position === "fixed" ? "" : "text-xs px-2 py-1 h-auto"}
                onClick={() => onMoveToColumn(column.id)}
              >
                Move to {column.title}
              </Button>
            ))}
            {onDelete && (
              <Button 
                variant="destructive" 
                size={position === "fixed" ? "sm" : "sm"}
                className={position === "fixed" ? "" : "text-xs px-2 py-1 h-auto"}
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
          </>
        )}
        <Button 
          variant="outline" 
          size={position === "fixed" ? "sm" : "sm"}
          className={position === "fixed" ? "" : "text-xs px-2 py-1 h-auto"}
          onClick={onClearSelection}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SelectionToolbar;
