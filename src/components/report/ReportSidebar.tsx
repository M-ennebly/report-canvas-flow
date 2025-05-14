
import { Project } from "@/types";
import { cn } from "@/lib/utils";
import ReportSidebarContent from "./sidebar/ReportSidebarContent";
import ReportSidebarToggle from "./sidebar/ReportSidebarToggle";

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
  return (
    <aside
      className="bg-white border-r w-64 h-screen sticky top-0 shadow-sm"
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between h-16 border-b px-4">
          <h2 className="font-semibold text-sm">
            Report Contents
          </h2>
        </div>

        {/* Show a message if there are no tasks */}
        {(!project.tasks || project.tasks.length === 0) && (
          <div className="p-4 text-sm text-slate-500">
            No tasks available in this report. Return to the workspace to create tasks and figures.
          </div>
        )}

        <ReportSidebarContent 
          project={project}
          isOpen={true}
          onTaskSelect={onTaskSelect}
          onFigureSelect={onFigureSelect}
        />
      </div>
    </aside>
  );
};

export default ReportSidebar;
