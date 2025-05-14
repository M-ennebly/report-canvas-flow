
import { useState } from "react";
import { ChevronRight, ChevronLeft, Image, FileText } from "lucide-react";
import { Project, Task as TaskType } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface ReportSidebarProps {
  project: Project;
  isOpen: boolean;
  onToggleSidebar: () => void;
  onTaskSelect: (taskId: string) => void;
  onFigureSelect: (figureId: string) => void;
}

const ReportSidebar = ({
  project,
  isOpen,
  onToggleSidebar,
  onTaskSelect,
  onFigureSelect,
}: ReportSidebarProps) => {
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [expandedColumns, setExpandedColumns] = useState<Record<string, boolean>>({
    design: true,
    analyse: true,
    dev: true,
    testing: true,
  });

  // Group tasks by column
  const groupedTasks = project.tasks.reduce((acc: Record<string, TaskType[]>, task) => {
    if (!acc[task.column]) {
      acc[task.column] = [];
    }
    acc[task.column].push(task);
    return acc;
  }, {});

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const toggleColumn = (column: string) => {
    setExpandedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const columnNames: Record<string, string> = {
    design: "Design",
    analyse: "Analysis",
    dev: "Development",
    testing: "Testing",
  };

  return (
    <aside
      className={cn(
        "bg-white border-r fixed md:relative h-screen z-10 transition-all duration-300 shadow-md md:shadow-none",
        isOpen ? "w-64 translate-x-0" : "-translate-x-full w-0 md:w-14 md:translate-x-0"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between h-16 border-b px-4">
          <h2 className={cn("font-semibold transition-opacity", isOpen ? "opacity-100" : "opacity-0 md:opacity-100")}>
            Report Contents
          </h2>
          <button
            onClick={onToggleSidebar}
            className="p-1 rounded-md hover:bg-slate-100"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} className="hidden md:block" />}
          </button>
        </div>

        <ScrollArea className="flex-1">
          {isOpen && (
            <div className="p-4">
              {Object.entries(groupedTasks).map(([column, tasks]) => (
                <div key={column} className="mb-4">
                  <Collapsible open={expandedColumns[column]} onOpenChange={() => toggleColumn(column)}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-slate-100 font-medium">
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            column === "design"
                              ? "bg-kanban-design"
                              : column === "analyse"
                              ? "bg-kanban-analyse"
                              : column === "dev"
                              ? "bg-kanban-dev"
                              : "bg-kanban-testing"
                          }`}
                        ></div>
                        <span>{columnNames[column] || column}</span>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 transform transition-transform ${
                          expandedColumns[column] ? "rotate-90" : ""
                        }`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="pl-4 mt-1 space-y-1">
                        {tasks.map((task) => (
                          <Collapsible key={task.id} 
                            open={expandedTasks[task.id]} 
                            onOpenChange={() => toggleTask(task.id)}
                          >
                            <CollapsibleTrigger 
                              className="flex items-center justify-between w-full p-2 rounded-md hover:bg-slate-100 text-sm"
                              onClick={() => onTaskSelect(task.id)}
                            >
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                <span className="truncate">{task.title}</span>
                              </div>
                              <ChevronRight
                                className={`h-3 w-3 transform transition-transform ${
                                  expandedTasks[task.id] ? "rotate-90" : ""
                                }`}
                              />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="pl-8 space-y-1 py-1">
                                {task.figures.map((figure, index) => (
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
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </aside>
  );
};

export default ReportSidebar;
