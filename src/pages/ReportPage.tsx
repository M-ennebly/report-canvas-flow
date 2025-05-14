
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Project } from "@/types";
import ReportSidebar from "@/components/report/ReportSidebar";
import ReportHeader from "@/components/report/ReportHeader";
import ReportContent from "@/components/report/ReportContent";
import { toast } from "sonner";

const ReportPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFigureId, setActiveFigureId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  
  // Initialize with default project data
  const [project, setProject] = useState<Project>({
    id: projectId || "demo-project",
    name: "Consultant Report Project",
    description: "This is a comprehensive consulting project focused on market analysis and strategic recommendations.",
    documents: [],
    tasks: [],
  });

  useEffect(() => {
    // Load project data from session storage (same as workspace)
    const storedProjectData = sessionStorage.getItem('projectData');
    const storedDocuments = sessionStorage.getItem('uploadedDocuments');
    
    // Try to load project description
    if (storedProjectData) {
      try {
        const projectData = JSON.parse(storedProjectData);
        if (projectData.description) {
          setProject(prev => ({
            ...prev,
            description: projectData.description
          }));
        }
      } catch (error) {
        console.error("Error parsing project data:", error);
      }
    }
    
    // Try to load documents
    if (storedDocuments) {
      try {
        const documents = JSON.parse(storedDocuments);
        if (Array.isArray(documents) && documents.length > 0) {
          setProject(prev => ({
            ...prev,
            documents: documents
          }));
          console.log("Loaded documents for report:", documents);
        }
      } catch (error) {
        console.error("Error parsing uploaded documents:", error);
      }
    }
    
    // Try to load tasks from session storage
    const storedTasks = sessionStorage.getItem('projectTasks');
    if (storedTasks) {
      try {
        const tasks = JSON.parse(storedTasks);
        if (Array.isArray(tasks) && tasks.length > 0) {
          setProject(prev => ({
            ...prev,
            tasks: tasks
          }));
          console.log("Loaded tasks for report:", tasks);
          toast.success(`Report generated with ${tasks.length} tasks`);
        } else {
          toast.info("No tasks found for the report");
        }
      } catch (error) {
        console.error("Error parsing tasks:", error);
        toast.error("Error loading tasks for report");
      }
    }

    // Scroll to element if active figure changes
    if (activeFigureId) {
      const element = document.getElementById(`figure-${activeFigureId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (activeTaskId) {
      const element = document.getElementById(`task-${activeTaskId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [activeFigureId, activeTaskId, projectId]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Now fixed width */}
      <ReportSidebar 
        project={project}
        isOpen={true} 
        onToggleSidebar={() => {}} // Empty function as we don't want it to collapse
        onTaskSelect={setActiveTaskId}
        onFigureSelect={setActiveFigureId} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ReportHeader 
          projectName={project.name}
          sidebarOpen={true}
          toggleSidebar={() => {}} // Empty function as we don't want it to collapse
        />

        {/* Report Content */}
        <ReportContent 
          project={project}
          activeFigureId={activeFigureId}
          activeTaskId={activeTaskId}
        />
      </div>
    </div>
  );
};

export default ReportPage;
