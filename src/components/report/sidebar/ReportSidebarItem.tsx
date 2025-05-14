
import { useState } from "react";
import { ChevronRight, FileText, Image } from "lucide-react";
import { Task as TaskType } from "@/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ReportSidebarItemProps {
  task: TaskType;
  onTaskSelect: (taskId: string) => void;
  onFigureSelect: (figureId: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const ReportSidebarItem = ({
  task,
  onTaskSelect,
  onFigureSelect,
  isExpanded,
  onToggle,
}: ReportSidebarItemProps) => {
  // Colors for badges based on column type
  const getBadgeClass = (column: string) => {
    switch(column) {
      case "design": return "bg-kanban-design text-white";
      case "analyse": return "bg-kanban-analyse text-white";
      case "dev": return "bg-kanban-dev text-white";
      case "testing": return "bg-kanban-testing text-white";
      default: return "";
    }
  };

  return (
    <Collapsible 
      open={isExpanded} 
      onOpenChange={onToggle}
    >
      <CollapsibleTrigger 
        className="flex items-center justify-between w-full p-2 rounded-md hover:bg-slate-100 text-sm"
        onClick={() => onTaskSelect(task.id)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{task.title}</span>
          <Badge 
            variant="outline" 
            className={`text-[0.65rem] px-1.5 py-0 h-4 ${getBadgeClass(task.column)}`}
          >
            {task.column}
          </Badge>
        </div>
        <ChevronRight
          className={cn(
            "h-3 w-3 transform transition-transform flex-shrink-0",
            isExpanded ? "rotate-90" : ""
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-8 space-y-1 py-1">
          {task.figures.map((figure) => (
            <button
              key={figure.id}
              className="flex items-center w-full text-left p-1.5 text-xs rounded-md hover:bg-slate-100"
              onClick={() => onFigureSelect(figure.id)}
            >
              <Image className="h-3 w-3 mr-2" />
              <span className="truncate">{figure.title}</span>
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ReportSidebarItem;
