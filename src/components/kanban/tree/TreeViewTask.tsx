
import React from "react";
import { Task } from "@/types";
import { ChevronRight, FolderIcon, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeViewTaskProps {
  task: Task;
  expandedTasks: Record<string, boolean>;
  selectedItems: {
    tasks: string[];
    figures: {taskId: string; figureId: string}[];
  };
  onTaskClick: (taskId: string) => void;
  toggleTask: (taskId: string) => void;
  toggleTaskSelection: (taskId: string, event: React.MouseEvent) => void;
  toggleFigureSelection: (taskId: string, figureId: string, event: React.MouseEvent) => void;
  addElementRef: (id: string, type: 'task' | 'figure', element: HTMLDivElement | null, taskId?: string) => void;
}

const TreeViewTask: React.FC<TreeViewTaskProps> = ({
  task,
  expandedTasks,
  selectedItems,
  onTaskClick,
  toggleTask,
  toggleTaskSelection,
  toggleFigureSelection,
  addElementRef,
}) => {
  return (
    <div key={task.id} className="mb-1">
      <div 
        ref={(el) => addElementRef(task.id, 'task', el)}
        className={cn(
          "flex items-center cursor-pointer py-1 px-1 hover:bg-slate-50 rounded",
          selectedItems.tasks.includes(task.id) ? "bg-blue-100" : ""
        )}
        onClick={(e) => toggleTaskSelection(task.id, e)}
        onDoubleClick={() => onTaskClick(task.id)}
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 mr-1 transition-transform",
            expandedTasks[task.id] ? "rotate-90" : ""
          )}
          onClick={(e) => {
            e.stopPropagation();
            toggleTask(task.id);
          }}
        />
        <FolderIcon className="h-4 w-4 mr-1 text-amber-500" />
        <span className="text-sm truncate">{task.title}</span>
        <span className="ml-2 text-xs text-slate-500">
          ({task.figures.length})
        </span>
      </div>
      
      {expandedTasks[task.id] && (
        <div className="ml-6 border-l pl-3 space-y-1 mt-1">
          {task.figures.map(figure => (
            <div 
              key={figure.id}
              ref={(el) => addElementRef(figure.id, 'figure', el, task.id)}
              className={cn(
                "flex items-center cursor-pointer py-1 px-1 hover:bg-slate-50 rounded",
                selectedItems.figures.some(f => f.figureId === figure.id) ? "bg-blue-100" : ""
              )}
              onClick={(e) => toggleFigureSelection(task.id, figure.id, e)}
            >
              <File className="h-4 w-4 mr-1 text-blue-500" />
              <span className="text-sm truncate">{figure.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeViewTask;
