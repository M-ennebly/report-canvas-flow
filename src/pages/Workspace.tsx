
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Figure, Task, Project } from "@/types";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import TaskEditorSidebar from "@/components/task/TaskEditorSidebar";
import DocumentPanel from "@/components/document/DocumentPanel";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";

const Workspace = () => {
  const { uploadType, labelId } = useParams<{ uploadType: string; labelId?: string }>();
  const navigate = useNavigate();

  // State for sidebar visibility on mobile
  const [isDocPanelOpen, setIsDocPanelOpen] = useState(true);
  
  // Demo data
  const [project, setProject] = useState<Project>({
    id: "demo-project",
    name: "Consultant Report Project",
    description: "",
    documents: [],
    tasks: generateDemoTasks(labelId),
  });

  // Selected task for editing
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    // If coming from label-based upload, set up the appropriate view
    if (uploadType === "label" && labelId) {
      toast.success(`Ready to upload files for the ${labelId.charAt(0).toUpperCase() + labelId.slice(1)} stage`);
    }
  }, [uploadType, labelId]);

  function generateDemoTasks(selectedLabel?: string): Task[] {
    // Generate demo tasks based on the selected label or create demo tasks for all columns
    const demoFigures = [
      { id: "fig1", title: "Market Segmentation", description: "Shows the breakdown of market segments", imageUrl: "https://picsum.photos/seed/chart1/300/200" },
      { id: "fig2", title: "Customer Journey", description: "Visualization of the customer journey process", imageUrl: "https://picsum.photos/seed/chart2/300/200" },
      { id: "fig3", title: "Product Architecture", description: "High-level product architecture", imageUrl: "https://picsum.photos/seed/chart3/300/200" },
      { id: "fig4", title: "Roadmap Timeline", description: "Timeline for product development", imageUrl: "https://picsum.photos/seed/chart4/300/200" },
      { id: "fig5", title: "Team Structure", description: "Organization chart for the project team", imageUrl: "https://picsum.photos/seed/chart5/300/200" },
      { id: "fig6", title: "Budget Allocation", description: "Budget breakdown by department", imageUrl: "https://picsum.photos/seed/chart6/300/200" },
    ];

    if (selectedLabel) {
      // If coming from label-based upload, just create tasks in that column
      return [
        {
          id: "task1",
          title: "Main Project Tasks",
          figures: demoFigures.slice(0, 3),
          column: selectedLabel as "design" | "analyse" | "dev" | "testing",
        }
      ];
    }

    // Otherwise create demo tasks for all columns
    return [
      {
        id: "task1",
        title: "Design System Architecture",
        figures: [demoFigures[0], demoFigures[1]],
        column: "design",
      },
      {
        id: "task2",
        title: "Market Analysis Report",
        figures: [demoFigures[2]],
        column: "analyse",
      },
      {
        id: "task3",
        title: "Develop Customer Portal",
        figures: [demoFigures[3], demoFigures[4]],
        column: "dev",
      },
      {
        id: "task4",
        title: "Test User Authentication",
        figures: [demoFigures[5]],
        column: "testing",
      },
    ];
  }

  const handleTaskClick = (taskId: string) => {
    const task = project.tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsEditorOpen(true);
    }
  };

  const handleTaskMove = (taskId: string, sourceColumn: string, targetColumn: string) => {
    setProject({
      ...project,
      tasks: project.tasks.map((task) =>
        task.id === taskId
          ? { ...task, column: targetColumn as "design" | "analyse" | "dev" | "testing" }
          : task
      ),
    });
    toast.success(`Task moved to ${targetColumn}`);
  };

  const handleSaveTask = (updatedTask: Task) => {
    setProject({
      ...project,
      tasks: project.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    });
  };

  const handleDescriptionChange = (description: string) => {
    setProject({
      ...project,
      description,
    });
  };

  const handleLinkedReportChange = (reportId: string) => {
    setProject({
      ...project,
      linkedReportId: reportId === "none" ? undefined : reportId,
    });
  };

  const handleDocumentUpload = (files: FileList) => {
    const newDocuments = Array.from(files).map((file) => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.name.split(".").pop() || "unknown",
      url: URL.createObjectURL(file),
      dateUploaded: new Date().toISOString(),
    }));

    setProject({
      ...project,
      documents: [...project.documents, ...newDocuments],
    });
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">
            {project.name} {labelId && `- ${labelId.charAt(0).toUpperCase() + labelId.slice(1)}`}
          </h1>
        </div>
        <Button>
          Generate Project Report
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex overflow-hidden">
        {/* Left Document Panel */}
        <div 
          className={`w-80 lg:w-96 transition-transform duration-300 fixed md:relative left-0 top-16 md:top-0 bottom-0 z-40 md:z-auto md:translate-x-0 ${
            isDocPanelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <DocumentPanel
            project={project}
            onDescriptionChange={handleDescriptionChange}
            onLinkedReportChange={handleLinkedReportChange}
            onDocumentUpload={handleDocumentUpload}
          />
        </div>

        {/* Kanban Board Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <KanbanBoard 
            tasks={project.tasks} 
            onTaskClick={handleTaskClick}
            onTaskMove={handleTaskMove}
          />
        </div>

        {/* Document Panel Toggle for Mobile */}
        <div className="md:hidden fixed bottom-4 left-4">
          <Button 
            variant="secondary"
            onClick={() => setIsDocPanelOpen(!isDocPanelOpen)}
            className="rounded-full h-12 w-12 p-0 shadow-lg"
          >
            {isDocPanelOpen ? <X className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Task Editor Sidebar (now on the right) */}
      <TaskEditorSidebar
        task={selectedTask}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Workspace;
