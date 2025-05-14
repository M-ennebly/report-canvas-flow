
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, List, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface ReportHeaderProps {
  projectName: string;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const ReportHeader = ({ projectName, sidebarOpen, toggleSidebar }: ReportHeaderProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(projectName);
  
  const handleDownloadPDF = () => {
    // In a real application, this would trigger a PDF generation process
    toast.success("Generating PDF...");
    setTimeout(() => {
      toast.success("PDF Downloaded Successfully");
    }, 1500);
  };

  const handleSaveName = () => {
    if (editedName.trim() === "") {
      toast.error("Project name cannot be empty");
      return;
    }
    
    // Update project name in session storage
    try {
      const projectData = JSON.parse(sessionStorage.getItem('projectData') || '{}');
      sessionStorage.setItem('projectData', JSON.stringify({
        ...projectData,
        name: editedName
      }));
      toast.success("Project name updated");
    } catch (error) {
      console.error("Error saving project name:", error);
    }
    
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setEditedName(projectName);
      setIsEditing(false);
    }
  };

  return (
    <header className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Workspace
        </Button>
      </div>
      
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
        {isEditing ? (
          <div className="flex items-center">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-56 text-lg font-semibold text-center"
            />
          </div>
        ) : (
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">
              {editedName} - Report
            </h1>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(true)} 
              className="ml-1 h-6 w-6 p-0"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
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
