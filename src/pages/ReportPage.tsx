
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Project } from "@/types";
import ReportSidebar from "@/components/report/ReportSidebar";
import ReportHeader from "@/components/report/ReportHeader";
import ReportContent from "@/components/report/ReportContent";

const ReportPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFigureId, setActiveFigureId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  
  // Demo data - in a real app, this would be fetched from an API
  const [project, setProject] = useState<Project>({
    id: "demo-project",
    name: "Consultant Report Project",
    description: "This is a comprehensive consulting project focused on market analysis and strategic recommendations.",
    documents: [],
    tasks: [
      {
        id: "task1",
        title: "Design System Architecture",
        figures: [
          { id: "fig1", title: "Market Segmentation", description: "Shows the breakdown of market segments", imageUrl: "https://picsum.photos/seed/chart1/300/200" },
          { id: "fig2", title: "Customer Journey", description: "Visualization of the customer journey process", imageUrl: "https://picsum.photos/seed/chart2/300/200" },
        ],
        column: "design",
      },
      {
        id: "task2",
        title: "Market Analysis Report",
        figures: [
          { id: "fig3", title: "Product Architecture", description: "High-level product architecture", imageUrl: "https://picsum.photos/seed/chart3/300/200" },
        ],
        column: "analyse",
      },
      {
        id: "task3",
        title: "Develop Customer Portal",
        figures: [
          { id: "fig4", title: "Roadmap Timeline", description: "Timeline for product development", imageUrl: "https://picsum.photos/seed/chart4/300/200" },
          { id: "fig5", title: "Team Structure", description: "Organization chart for the project team", imageUrl: "https://picsum.photos/seed/chart5/300/200" },
        ],
        column: "dev",
      },
      {
        id: "task4",
        title: "Test User Authentication",
        figures: [
          { id: "fig6", title: "Budget Allocation", description: "Budget breakdown by department", imageUrl: "https://picsum.photos/seed/chart6/300/200" },
        ],
        column: "testing",
      },
    ],
  });

  useEffect(() => {
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
  }, [activeFigureId, activeTaskId]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <ReportSidebar 
        project={project} 
        isOpen={sidebarOpen} 
        onToggleSidebar={toggleSidebar}
        onTaskSelect={setActiveTaskId}
        onFigureSelect={setActiveFigureId} 
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'}`}>
        {/* Header */}
        <ReportHeader 
          projectName={project.name}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
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
