
import React from "react";
import { Task } from "@/types";
import { ChevronRight, FolderIcon, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  isSelecting: boolean;
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
  isSelecting,
}) => {
  return (
    <div key={task.id} className="mb-3">
      <div 
        ref={(el) => addElementRef(task.id, 'task', el)}
        className={cn(
          "flex items-center cursor-pointer py-1 px-1 hover:bg-slate-50 rounded",
          selectedItems.tasks.includes(task.id) && !isSelecting ? "bg-blue-100" : "",
          selectedItems.tasks.includes(task.id) && isSelecting ? "bg-blue-200" : ""
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
        <div className="ml-6 pl-3 mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {task.figures.map(figure => (
              <div 
                key={figure.id}
                ref={(el) => addElementRef(figure.id, 'figure', el, task.id)}
                className={cn(
                  "flex flex-col bg-white border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow",
                  selectedItems.figures.some(f => f.figureId === figure.id) && !isSelecting ? "ring-2 ring-blue-400" : "",
                  selectedItems.figures.some(f => f.figureId === figure.id) && isSelecting ? "ring-2 ring-blue-500" : ""
                )}
                onClick={(e) => toggleFigureSelection(task.id, figure.id, e)}
              >
                <AspectRatio ratio={16/12} className="bg-slate-100 flex items-center justify-center">
                  <File className="h-10 w-10 text-blue-400" />
                </AspectRatio>
                <div className="p-2">
                  <span className="text-xs font-medium truncate block">{figure.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeViewTask;
