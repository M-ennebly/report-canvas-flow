
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUp, Tag, Trash2, FileText, BarChart, CheckCircle2, Clock, Layers, MoveRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Document } from "@/types";
import BulkUploadTab from "@/components/upload/BulkUploadTab";
import LabelUploadTab from "@/components/upload/LabelUploadTab";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const LandingPage = () => {
  const navigate = useNavigate();
  
  // Separate state for bulk and label uploads
  const [bulkFiles, setBulkFiles] = useState<FileList | null>(null);
  const [bulkDocuments, setBulkDocuments] = useState<Document[]>([]);
  
  const [labelFiles, setLabelFiles] = useState<FileList | null>(null);
  const [labelDocuments, setLabelDocuments] = useState<Document[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("bulk");
  
  const labels = [
    { id: "design", name: "Design", color: "bg-kanban-design" },
    { id: "analyse", name: "Analyse", color: "bg-kanban-analyse" },
    { id: "dev", name: "Dev", color: "bg-kanban-dev" },
    { id: "testing", name: "Testing", color: "bg-kanban-testing" }
  ];

  const handleBulkUpload = (files: FileList) => {
    // Convert FileList to Document[] for preview
    const newDocs: Document[] = Array.from(files).map(file => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.name.split(".").pop() || "unknown",
      url: URL.createObjectURL(file),
      dateUploaded: new Date().toISOString(),
    }));
    
    setBulkFiles(files);
    // Append new documents to existing ones instead of replacing
    setBulkDocuments(prevDocs => [...prevDocs, ...newDocs]);
    toast.success(`${files.length} document(s) selected`);
  };

  const handleLabelUpload = (files: FileList, labelId: string) => {
    // Convert FileList to Document[] for preview
    const newDocs: Document[] = Array.from(files).map(file => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.name.split(".").pop() || "unknown",
      url: URL.createObjectURL(file),
      dateUploaded: new Date().toISOString(),
      label: labelId, // Add the label to the document
    }));
    
    setLabelFiles(files);
    // Append new documents to existing ones instead of replacing
    setLabelDocuments(prevDocs => [...prevDocs, ...newDocs]);
    
    if (!selectedLabels.includes(labelId)) {
      setSelectedLabels([...selectedLabels, labelId]);
    }
    toast.success(`${files.length} document(s) selected for ${labelId}`);
  };

  const handleProcessFiles = (uploadType: 'bulk' | 'label') => {
    if (uploadType === 'bulk' && bulkDocuments.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    if (uploadType === 'label' && labelDocuments.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    if (uploadType === 'label' && selectedLabels.length === 0) {
      toast.error("Please select at least one label");
      return;
    }

    setIsLoading(true);

    // Store the appropriate documents in sessionStorage and navigate immediately
    if (uploadType === 'bulk') {
      sessionStorage.setItem('uploadedDocuments', JSON.stringify(bulkDocuments));
      navigate("/workspace/bulk");
    } else {
      sessionStorage.setItem('uploadedDocuments', JSON.stringify(labelDocuments));
      sessionStorage.setItem('selectedLabels', JSON.stringify(selectedLabels));
      navigate(`/workspace/label/${selectedLabels[0]}`);
    }
  };

  const removeBulkDocument = (docId: string) => {
    setBulkDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
    
    // If we've removed all documents, clear the selected files
    if (bulkDocuments.length <= 1) {
      setBulkFiles(null);
    }
  };

  const removeLabelDocument = (docId: string) => {
    setLabelDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
    
    // If we've removed all documents, clear the selected files
    if (labelDocuments.length <= 1) {
      setLabelFiles(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart className="h-7 w-7 text-kanban-analyse" />
            <h1 className="text-xl font-semibold text-slate-800">Figure Management System</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-slate-600 hover:text-kanban-dev font-medium transition-colors">Features</a>
            <a href="#workflow" className="text-slate-600 hover:text-kanban-design font-medium transition-colors">Workflow</a>
            <a href="#upload" className="text-slate-600 hover:text-kanban-testing font-medium transition-colors">Upload</a>
          </nav>
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900" onClick={() => navigate("/workspace/bulk")}>
            Dashboard
            <MoveRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-800 to-slate-900 py-20 text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-gradient-to-r from-kanban-design to-kanban-analyse bg-clip-text text-transparent text-lg font-medium mb-2 rounded-full">
                Streamline Your Consulting Workflow
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Intelligent Figure Management for Consultants
              </h1>
              <p className="text-lg text-slate-300 max-w-lg">
                Transform how you organize and utilize figures from documents with our intuitive kanban workflow system. Save time, increase productivity, and deliver exceptional reports.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-kanban-analyse hover:bg-kanban-analyse/90 text-white" size="lg" onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}>
                  Get Started
                  <MoveRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-slate-500 text-white hover:bg-white/10" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-2xl relative bg-white/10 backdrop-blur-sm border border-white/10 p-4">
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-kanban-design via-kanban-analyse to-kanban-dev"></div>
                <div className="absolute top-4 left-4 right-4 h-8 bg-slate-700/50 rounded flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-kanban-design"></div>
                  <div className="w-3 h-3 rounded-full bg-kanban-analyse"></div>
                  <div className="w-3 h-3 rounded-full bg-kanban-dev"></div>
                  <div className="text-sm text-white/70">Figure Management Dashboard</div>
                </div>
                <div className="absolute top-16 inset-x-4 bottom-4 grid grid-cols-3 gap-4 opacity-70">
                  <div className="bg-slate-800/50 rounded-md p-3">
                    <div className="h-4 w-3/4 bg-white/20 rounded mb-3"></div>
                    <div className="h-20 bg-kanban-design/30 rounded mb-2"></div>
                    <div className="h-20 bg-kanban-design/20 rounded"></div>
                  </div>
                  <div className="bg-slate-800/50 rounded-md p-3">
                    <div className="h-4 w-3/4 bg-white/20 rounded mb-3"></div>
                    <div className="h-20 bg-kanban-analyse/30 rounded mb-2"></div>
                    <div className="h-20 bg-kanban-analyse/20 rounded"></div>
                  </div>
                  <div className="bg-slate-800/50 rounded-md p-3">
                    <div className="h-4 w-3/4 bg-white/20 rounded mb-3"></div>
                    <div className="h-20 bg-kanban-dev/30 rounded mb-2"></div>
                    <div className="h-20 bg-kanban-dev/20 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-kanban-design/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-kanban-analyse/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Powerful Features for Consultants</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to efficiently manage figures and create impactful reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="h-2 bg-kanban-design"></div>
              <CardHeader className="pb-2">
                <div className="p-3 bg-kanban-design/10 rounded-full w-fit mb-3">
                  <FileText className="h-6 w-6 text-kanban-design" />
                </div>
                <CardTitle>Document Processing</CardTitle>
                <CardDescription className="text-slate-600">Extract and categorize figures from multiple document types</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Upload PDFs, Word files, and more to automatically extract figures and organize them into your workflow.
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="h-2 bg-kanban-analyse"></div>
              <CardHeader className="pb-2">
                <div className="p-3 bg-kanban-analyse/10 rounded-full w-fit mb-3">
                  <Layers className="h-6 w-6 text-kanban-analyse" />
                </div>
                <CardTitle>Kanban Organization</CardTitle>
                <CardDescription className="text-slate-600">Intuitive drag-and-drop organization</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Organize your figures into customizable columns with our visual kanban board to track progress through your workflow.
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="h-2 bg-kanban-dev"></div>
              <CardHeader className="pb-2">
                <div className="p-3 bg-kanban-dev/10 rounded-full w-fit mb-3">
                  <BarChart className="h-6 w-6 text-kanban-dev" />
                </div>
                <CardTitle>Report Generation</CardTitle>
                <CardDescription className="text-slate-600">Create professional reports with your figures</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Generate polished reports automatically based on your organized figures, ready for client presentations.
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="h-2 bg-kanban-testing"></div>
              <CardHeader className="pb-2">
                <div className="p-3 bg-kanban-testing/10 rounded-full w-fit mb-3">
                  <CheckCircle2 className="h-6 w-6 text-kanban-testing" />
                </div>
                <CardTitle>Project Tracking</CardTitle>
                <CardDescription className="text-slate-600">Monitor progress from start to finish</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Track all aspects of your project workflow with comprehensive analytics and progress monitoring tools.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our streamlined workflow makes figure management simple and efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md border border-slate-100 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-kanban-design flex items-center justify-center text-white font-bold text-lg shadow-lg">1</div>
              <FileUp className="h-10 w-10 text-kanban-design mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Upload Documents</h3>
              <p className="text-slate-600">
                Upload your documents via bulk upload or by categories using our label-based system.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-slate-100 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-kanban-analyse flex items-center justify-center text-white font-bold text-lg shadow-lg">2</div>
              <Tag className="h-10 w-10 text-kanban-analyse mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Organize & Categorize</h3>
              <p className="text-slate-600">
                Sort your figures into the kanban board and organize them according to your workflow stages.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-slate-100 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-kanban-dev flex items-center justify-center text-white font-bold text-lg shadow-lg">3</div>
              <BarChart className="h-10 w-10 text-kanban-dev mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Generate Reports</h3>
              <p className="text-slate-600">
                Create professional reports with your organized figures ready for client presentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Start Your Project</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Upload your documents and begin organizing your figures
            </p>
          </div>

          <Tabs 
            defaultValue="bulk" 
            className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl border border-slate-200"
            onValueChange={(value) => setActiveTab(value)}
          >
            <div className="p-6 bg-slate-50 border-b border-slate-200 rounded-t-xl">
              <TabsList className="grid grid-cols-2 p-1 bg-slate-200 rounded-lg">
                <TabsTrigger value="bulk" className="text-lg py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 data-[state=active]:border-b-2 data-[state=active]:border-kanban-analyse rounded-md">
                  <FileUp className="mr-2 h-5 w-5" />
                  Bulk Upload
                </TabsTrigger>
                <TabsTrigger value="label" className="text-lg py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 data-[state=active]:border-b-2 data-[state=active]:border-kanban-design rounded-md">
                  <Tag className="mr-2 h-5 w-5" />
                  Label-Based Upload
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="bulk">
                <BulkUploadTab 
                  selectedFiles={bulkFiles}
                  uploadedDocuments={bulkDocuments}
                  isLoading={isLoading}
                  onFilesSelected={handleBulkUpload}
                  onRemoveDocument={removeBulkDocument}
                  onProcess={() => handleProcessFiles('bulk')}
                />
              </TabsContent>
              
              <TabsContent value="label">
                <LabelUploadTab 
                  labels={labels}
                  selectedFiles={labelFiles}
                  selectedLabels={selectedLabels}
                  uploadedDocuments={labelDocuments}
                  isLoading={isLoading}
                  onLabelUpload={handleLabelUpload}
                  onRemoveDocument={removeLabelDocument}
                  onProcess={() => handleProcessFiles('label')}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart className="h-6 w-6 text-kanban-analyse" />
                <h3 className="text-xl font-semibold">Figure Management</h3>
              </div>
              <p className="text-slate-400">
                Streamline your report creation by organizing figures from documents into a structured workflow
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Features</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Document Processing</li>
                <li>Kanban Organization</li>
                <li>Report Generation</li>
                <li>Project Tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Documentation</li>
                <li>Tutorials</li>
                <li>API Reference</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li>info@figuremanagement.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Main St, Suite 100</li>
                <li>San Francisco, CA 94105</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            <p>© 2025 Figure Management System for Consultants. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
