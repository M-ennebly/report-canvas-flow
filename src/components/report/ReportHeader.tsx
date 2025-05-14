
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ReportHeaderProps {
  projectName: string;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const ReportHeader = ({ projectName, sidebarOpen, toggleSidebar }: ReportHeaderProps) => {
  const navigate = useNavigate();
  
  const handleDownloadPDF = () => {
    // In a real application, this would trigger a PDF generation process
    toast.success("Generating PDF...");
    setTimeout(() => {
      toast.success("PDF Downloaded Successfully");
    }, 1500);
  };

  return (
    <header className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Workspace
        </Button>
        <h1 className="text-lg font-semibold">{projectName} - Report</h1>
      </div>
      <div className="flex items-center gap-2">
        {!sidebarOpen && (
          <Button variant="outline" size="sm" onClick={toggleSidebar} className="md:hidden">
            <List className="h-4 w-4" />
            <span className="ml-2">Content</span>
          </Button>
        )}
        <Button onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </header>
  );
};

export default ReportHeader;
