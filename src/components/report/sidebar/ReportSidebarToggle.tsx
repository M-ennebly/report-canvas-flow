
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReportSidebarToggleProps {
  isOpen: boolean;
  onToggleSidebar: () => void;
}

const ReportSidebarToggle = ({ isOpen, onToggleSidebar }: ReportSidebarToggleProps) => {
  return (
    <button
      onClick={onToggleSidebar}
      className="p-1 rounded-md hover:bg-slate-100"
      aria-label="Toggle sidebar"
    >
      {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} className="hidden md:block" />}
    </button>
  );
};

export default ReportSidebarToggle;
