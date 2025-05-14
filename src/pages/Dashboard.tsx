
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Clock, 
  FileText, 
  Folders, 
  Loader, 
  FileCheck, 
  Plus, 
  FileMinus,
  Eye 
} from "lucide-react";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import UploadDropzone from "@/components/upload/UploadDropzone";
import { Document } from "@/types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("New Project");
  const [uploadMode, setUploadMode] = useState<"bulk" | "label">("bulk");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  
  // Demo projects data
  const projects = [
    {
      id: "project-1",
      name: "Almond Processing System Analysis",
      lastUpdated: "2025-05-10",
      status: "completed",
      hasReport: true
    },
    {
      id: "project-2",
      name: "Agricultural Equipment Evaluation",
      lastUpdated: "2025-05-12",
      status: "in-progress",
      hasReport: false
    },
    {
      id: "project-3",
      name: "Water Treatment Facility Report",
      lastUpdated: "2025-05-13",
      status: "draft",
      hasReport: false
    },
    {
      id: "project-4",
      name: "Annual Sustainability Analysis",
      lastUpdated: "2025-05-14",
      status: "completed",
      hasReport: true
    }
  ];

  // Handle file upload
  const handleFilesSelected = (files: FileList) => {
    setSelectedFiles(files);
  };

  // Create new project
  const handleCreateProject = () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Please upload at least one document");
      return;
    }

    // Convert files to Document objects for storage
    const documents: Document[] = Array.from(selectedFiles).map(file => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.name.split(".").pop() || "unknown",
      url: URL.createObjectURL(file),
      dateUploaded: new Date().toISOString()
    }));

    // Store project data in session storage
    sessionStorage.setItem('uploadedDocuments', JSON.stringify(documents));
    sessionStorage.setItem('projectData', JSON.stringify({ name: projectName }));
    
    // Close modal and navigate to workspace
    setIsNewProjectModalOpen(false);
    toast.success("Project created successfully");
    navigate(`/workspace/${uploadMode}`);
  };

  // Navigate to project workspace
  const handleEditProject = (projectId: string) => {
    // For demo purposes, we'll just navigate to the workspace
    navigate(`/workspace/bulk`);
  };

  // Navigate to project report
  const handleViewReport = (projectId: string) => {
    navigate(`/report/demo-project`);
  };

  // Helper function to render status icon
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FileCheck className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Loader className="h-4 w-4 text-blue-500" />;
      case "draft":
        return <FileMinus className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Digiclaim Dashboard</h1>
          <Button 
            onClick={() => setIsNewProjectModalOpen(true)}
            className="bg-kanban-analyse hover:bg-kanban-analyse/90 text-white"
          >
            <Plus className="mr-2 h-5 w-5" /> New Project
          </Button>
        </div>
        
        <p className="text-slate-500 mb-8">Create and manage your projects below</p>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Folders className="mr-2 h-5 w-5 text-kanban-design" />
                Total Projects Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">24</p>
              <p className="text-sm text-slate-500">Across all clients</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5 text-kanban-analyse" />
                Reports Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">16</p>
              <p className="text-sm text-slate-500">Ready for submission</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Loader className="mr-2 h-5 w-5 text-kanban-dev" />
                Projects In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">6</p>
              <p className="text-sm text-slate-500">Not yet finalized</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-yellow-500" />
                Average Time to Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">3.2 days</p>
              <p className="text-sm text-slate-500">Based on last 10 projects</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Project List */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
          <div className="divide-y">
            {projects.map((project) => (
              <div key={project.id} className="py-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{project.name}</h3>
                    <span className="ml-2 flex items-center text-sm text-slate-500">
                      {renderStatusIcon(project.status)}
                      <span className="ml-1 capitalize">{project.status.replace("-", " ")}</span>
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">Last updated: {project.lastUpdated}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditProject(project.id)}
                  >
                    Edit
                  </Button>
                  
                  {project.hasReport ? (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-600"
                      onClick={() => handleViewReport(project.id)}
                    >
                      <Eye className="mr-1 h-4 w-4" /> 
                      View Report
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-slate-400 border-slate-200"
                      disabled
                    >
                      <FileText className="mr-1 h-4 w-4" /> 
                      No report yet
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* New Project Modal */}
      <Dialog open={isNewProjectModalOpen} onOpenChange={setIsNewProjectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new project
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <label htmlFor="projectName" className="text-sm font-medium">Project Name</label>
              <Input 
                id="projectName" 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)} 
                placeholder="Enter project name" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Mode</label>
              <select 
                className="w-full h-10 px-3 py-2 text-sm border rounded-md"
                value={uploadMode}
                onChange={(e) => setUploadMode(e.target.value as "bulk" | "label")}
              >
                <option value="bulk">Bulk Upload</option>
                <option value="label">Label-Based Upload</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Documents</label>
              <UploadDropzone 
                onFilesSelected={handleFilesSelected}
                selectedFiles={selectedFiles}
              />
            </div>
          </div>
          
          <div className="mt-5 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsNewProjectModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
