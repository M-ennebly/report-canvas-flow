
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
      className={cn(
        "bg-white border-r fixed md:relative h-screen z-10 transition-all duration-300 shadow-md md:shadow-none",
        isOpen ? "w-64 translate-x-0" : "-translate-x-full w-0 md:w-14 md:translate-x-0"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between h-16 border-b px-4">
          <h2 className={cn("font-semibold text-sm transition-opacity", isOpen ? "opacity-100" : "opacity-0 md:opacity-100")}>
            Report Contents
          </h2>
          <ReportSidebarToggle isOpen={isOpen} onToggleSidebar={onToggleSidebar} />
        </div>

        {/* Show a message if there are no tasks */}
        {(!project.tasks || project.tasks.length === 0) && isOpen && (
          <div className="p-4 text-sm text-slate-500">
            No tasks available in this report. Return to the workspace to create tasks and figures.
          </div>
        )}

        <ReportSidebarContent 
          project={project}
          isOpen={isOpen}
          onTaskSelect={onTaskSelect}
          onFigureSelect={onFigureSelect}
        />
      </div>
    </aside>
  );
};

export default ReportSidebar;
