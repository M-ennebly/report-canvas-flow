
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Figure, Task, Project } from "@/types";
import { ChevronLeft, Download, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "sonner";

const ReportPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  
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

  const handleDownloadPDF = () => {
    // In a real application, this would trigger a PDF generation process
    toast.success("Generating PDF...");
    setTimeout(() => {
      toast.success("PDF Downloaded Successfully");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Workspace
          </Button>
          <h1 className="text-lg font-semibold">{project.name} - Report</h1>
        </div>
        <Button onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </header>

      {/* Report Content */}
      <div className="container mx-auto py-8 px-4">
        {/* Project Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{project.description || "No project description available."}</p>
          </CardContent>
        </Card>

        {/* Tasks & Figures */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">Project Figures by Task</h2>
          
          {project.tasks.map((task) => (
            <Card key={task.id} className="mb-6">
              <CardHeader className="border-b">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    task.column === "design" ? "bg-kanban-design" : 
                    task.column === "analyse" ? "bg-kanban-analyse" : 
                    task.column === "dev" ? "bg-kanban-dev" : "bg-kanban-testing"
                  }`}></div>
                  <CardTitle>{task.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {task.figures.length > 0 ? (
                  <div className="space-y-8">
                    {task.figures.map((figure) => (
                      <div key={figure.id} className="grid md:grid-cols-2 gap-6 pb-6 border-b last:border-0">
                        <div className="aspect-ratio-wrapper">
                          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md border bg-slate-100">
                            <img
                              src={figure.imageUrl}
                              alt={figure.title}
                              className="h-full w-full object-cover"
                            />
                          </AspectRatio>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">{figure.title}</h3>
                          <p className="text-slate-700">{figure.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No figures available for this task.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
