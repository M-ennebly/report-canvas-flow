
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from "@/types";
import { useState } from "react";
import ReportSidebarColumnGroup from "./ReportSidebarColumnGroup";

interface ReportSidebarContentProps {
  project: Project;
  isOpen: boolean;
  onTaskSelect: (taskId: string) => void;
  onFigureSelect: (figureId: string) => void;
}

const ReportSidebarContent = ({
  project,
  isOpen,
  onTaskSelect,
  onFigureSelect,
}: ReportSidebarContentProps) => {
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [expandedColumns, setExpandedColumns] = useState<Record<string, boolean>>({
    design: true,
    analyse: true,
    dev: true,
    testing: true,
  });

  // Group tasks by column
  const groupedTasks = project.tasks.reduce((acc: Record<string, any[]>, task) => {
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

  if (!isOpen) {
    return null;
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4">
        {Object.entries(groupedTasks).map(([column, tasks]) => (
          <ReportSidebarColumnGroup
            key={column}
            column={column}
            tasks={tasks}
            expandedTasks={expandedTasks}
            isColumnExpanded={expandedColumns[column] || false}
            onToggleColumn={() => toggleColumn(column)}
            onToggleTask={toggleTask}
            onTaskSelect={onTaskSelect}
            onFigureSelect={onFigureSelect}
            columnNames={columnNames}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ReportSidebarContent;
