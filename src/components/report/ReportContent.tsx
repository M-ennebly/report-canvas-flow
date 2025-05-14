
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

  // Check if we have any tasks
  const hasTasks = project.tasks && project.tasks.length > 0;

  return (
    <ScrollArea className="flex-1">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Project Description */}
        <ReportProjectOverview description={project.description} />

        {/* No tasks message */}
        {!hasTasks && (
          <div className="text-center p-10 bg-white rounded-lg shadow-sm border mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No tasks available</h3>
            <p className="text-gray-500">
              Return to the workspace to create tasks and figures for your report.
            </p>
          </div>
        )}

        {/* Tasks & Figures by Column/Label */}
        {hasTasks && (
          <div className="space-y-12">
            {Object.entries(tasksByColumn).map(([column, tasks]) => (
              <ReportColumnSection 
                key={column} 
                columnName={columnNames[column] || column} 
                tasks={tasks} 
              />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ReportContent;
