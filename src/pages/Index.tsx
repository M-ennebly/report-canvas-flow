
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUp, Tag, BarChart, MoveRight } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Document } from "@/types";
import BulkUploadTab from "@/components/upload/BulkUploadTab";
import LabelUploadTab from "@/components/upload/LabelUploadTab";

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
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900" onClick={() => navigate("/workspace/bulk")}>
            Dashboard
            <MoveRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-800 to-slate-900 py-16 text-white overflow-hidden">
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
              <div>
                <Button className="bg-kanban-analyse hover:bg-kanban-analyse/90 text-white" size="lg" onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}>
                  Get Started
                  <MoveRight className="ml-2 h-5 w-5" />
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

      {/* Enhanced Upload Section */}
      <section id="upload" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Start Your Project</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Upload your documents and begin organizing your figures
            </p>
          </div>

          <Tabs 
            defaultValue="bulk" 
            className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl border border-slate-200 overflow-hidden"
            onValueChange={(value) => setActiveTab(value)}
          >
            <div className="p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
              <TabsList className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg shadow-inner">
                <TabsTrigger 
                  value="bulk" 
                  className="text-base py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-slate-900 data-[state=active]:border-b-2 data-[state=active]:border-kanban-analyse rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <div className={`p-2 rounded-full ${activeTab === "bulk" ? "bg-kanban-analyse/10 text-kanban-analyse" : "bg-slate-200 text-slate-500"} transition-colors duration-200`}>
                    <FileUp className="h-5 w-5" />
                  </div>
                  <span>Bulk Upload</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="label" 
                  className="text-base py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-slate-900 data-[state=active]:border-b-2 data-[state=active]:border-kanban-design rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <div className={`p-2 rounded-full ${activeTab === "label" ? "bg-kanban-design/10 text-kanban-design" : "bg-slate-200 text-slate-500"} transition-colors duration-200`}>
                    <Tag className="h-5 w-5" />
                  </div>
                  <span>Label-Based Upload</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-8">
              <TabsContent value="bulk" className="mt-0 animate-fade-in">
                <BulkUploadTab 
                  selectedFiles={bulkFiles}
                  uploadedDocuments={bulkDocuments}
                  isLoading={isLoading}
                  onFilesSelected={handleBulkUpload}
                  onRemoveDocument={removeBulkDocument}
                  onProcess={() => handleProcessFiles('bulk')}
                />
              </TabsContent>
              
              <TabsContent value="label" className="mt-0 animate-fade-in">
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

              <div className="mt-8 bg-slate-50 p-5 rounded-lg border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full shrink-0">
                    <BarChart className="h-6 w-6 text-kanban-analyse" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 mb-1">Ready to get started?</h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Upload your documents and our system will help you organize figures into a structured workflow, 
                      making it easy to create professional reports.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="default" 
                        size="sm"
                        className="bg-gradient-to-r from-kanban-analyse to-kanban-analyse/80 hover:from-kanban-analyse/90 hover:to-kanban-analyse text-white border-none"
                        onClick={() => document.querySelector('input[type="file"]')?.click()}
                      >
                        <FileUp className="h-4 w-4 mr-1" /> Select Files
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-slate-300 hover:bg-slate-100" 
                        onClick={() => navigate("/workspace/bulk")}
                      >
                        Go to Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
