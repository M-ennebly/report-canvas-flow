
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project, Task } from "@/types";
import ReportColumnSection from "./ReportColumnSection";
import ReportProjectOverview from "./ReportProjectOverview";

interface ReportContentProps {
  project: Project;
  activeFigureId: string | null;
  activeTaskId: string | null;
}

const ReportContent = ({ project, activeFigureId, activeTaskId }: ReportContentProps) => {
  // Column display names
  const columnNames: Record<string, string> = {
    design: "Design",
    analyse: "Analysis",
    dev: "Development",
    testing: "Testing"
  };

  // Group tasks by column (label)
  const tasksByColumn = project.tasks.reduce((acc: Record<string, Task[]>, task) => {
    if (!acc[task.column]) {
      acc[task.column] = [];
    }
    acc[task.column].push(task);
    return acc;
  }, {});

  return (
    <ScrollArea className="flex-1">
      <div className="container mx-auto py-8 px-4">
        {/* Project Description */}
        <ReportProjectOverview description={project.description} />

        {/* Tasks & Figures by Column/Label */}
        <div className="space-y-12">
          {Object.entries(tasksByColumn).map(([column, tasks]) => (
            <ReportColumnSection 
              key={column} 
              columnName={columnNames[column] || column} 
              tasks={tasks} 
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ReportContent;
