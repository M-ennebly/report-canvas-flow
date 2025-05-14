
import { ChevronRight } from "lucide-react";
import { Task as TaskType } from "@/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import ReportSidebarItem from "./ReportSidebarItem";

interface ReportSidebarColumnGroupProps {
  column: string;
  tasks: TaskType[];
  expandedTasks: Record<string, boolean>;
  isColumnExpanded: boolean;
  onToggleColumn: () => void;
  onToggleTask: (taskId: string) => void;
  onTaskSelect: (taskId: string) => void;
  onFigureSelect: (figureId: string) => void;
  columnNames: Record<string, string>;
}

const ReportSidebarColumnGroup = ({
  column,
  tasks,
  expandedTasks,
  isColumnExpanded,
  onToggleColumn,
  onToggleTask,
  onTaskSelect,
  onFigureSelect,
  columnNames,
}: ReportSidebarColumnGroupProps) => {
  // Determine the column color class
  const getColumnColorClass = (column: string) => {
    switch(column) {
      case "design": return "bg-kanban-design";
      case "analyse": return "bg-kanban-analyse";
      case "dev": return "bg-kanban-dev";
      case "testing": return "bg-kanban-testing";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="mb-4">
      <Collapsible open={isColumnExpanded} onOpenChange={onToggleColumn}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-slate-100 font-medium">
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${getColumnColorClass(column)}`}
            ></div>
            <span>{columnNames[column] || column}</span>
          </div>
          <ChevronRight
            className={cn(
              "h-4 w-4 transform transition-transform",
              isColumnExpanded ? "rotate-90" : ""
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pl-4 mt-1 space-y-1">
            {tasks.map((task) => (
              <ReportSidebarItem
                key={task.id}
                task={task}
                isExpanded={expandedTasks[task.id] || false}
                onToggle={() => onToggleTask(task.id)}
                onTaskSelect={onTaskSelect}
                onFigureSelect={onFigureSelect}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ReportSidebarColumnGroup;
