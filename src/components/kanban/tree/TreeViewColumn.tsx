
import React from "react";
import { Task } from "@/types";
import { ChevronRight, FolderIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import TreeViewTask from "./TreeViewTask";

interface TreeViewColumnProps {
  columnId: string;
  columnTitle: string;
  columnTasks: Task[];
  expandedColumns: Record<string, boolean>;
  expandedTasks: Record<string, boolean>;
  selectedItems: {
    tasks: string[];
    figures: {taskId: string; figureId: string}[];
  };
  onTaskClick: (taskId: string) => void;
  toggleColumn: (columnId: string) => void;
  toggleTask: (taskId: string) => void;
  toggleTaskSelection: (taskId: string, event: React.MouseEvent) => void;
  toggleFigureSelection: (taskId: string, figureId: string, event: React.MouseEvent) => void;
  addElementRef: (id: string, type: 'task' | 'figure', element: HTMLDivElement | null, taskId?: string) => void;
  getColumnColor: (columnId: string) => string;
  isSelecting: boolean;
}

const TreeViewColumn: React.FC<TreeViewColumnProps> = ({
  columnId,
  columnTitle,
  columnTasks,
  expandedColumns,
  expandedTasks,
  selectedItems,
  onTaskClick,
  toggleColumn,
  toggleTask,
  toggleTaskSelection,
  toggleFigureSelection,
  addElementRef,
  getColumnColor,
  isSelecting,
}) => {
  return (
    <div key={columnId} className="mb-4">
      <div 
        className="flex items-center cursor-pointer py-1 px-1 hover:bg-slate-50 rounded"
        onClick={() => toggleColumn(columnId)}
        ref={(el) => addElementRef(columnId, 'task', el)}
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 mr-1 transition-transform",
            expandedColumns[columnId] ? "rotate-90" : ""
          )}
        />
        <div className={`w-3 h-3 rounded-full mr-2 ${getColumnColor(columnId).split(' ')[0]}`}></div>
        <span className="font-medium">{columnTitle}</span>
        <span className="ml-2 text-xs text-slate-500">
          ({columnTasks.length})
        </span>
      </div>
      
      {expandedColumns[columnId] && (
        <div className="ml-6 border-l pl-3 space-y-1 mt-1">
          {columnTasks.map(task => (
            <TreeViewTask
              key={task.id}
              task={task}
              expandedTasks={expandedTasks}
              selectedItems={selectedItems}
              onTaskClick={onTaskClick}
              toggleTask={toggleTask}
              toggleTaskSelection={toggleTaskSelection}
              toggleFigureSelection={toggleFigureSelection}
              addElementRef={addElementRef}
              isSelecting={isSelecting}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeViewColumn;
