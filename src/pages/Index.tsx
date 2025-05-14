
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUp, Tag, Trash2, FileText, BarChart, CheckCircle2, Clock, Layers } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            Figure Management for Consultants
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Streamline your report creation by organizing figures from documents into a structured workflow
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-filter backdrop-blur-sm border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <FileText className="h-8 w-8 text-kanban-design mb-2" />
              <CardTitle>Document Processing</CardTitle>
              <CardDescription>Upload and extract figures from multiple documents</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-filter backdrop-blur-sm border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <Layers className="h-8 w-8 text-kanban-analyse mb-2" />
              <CardTitle>Kanban Organization</CardTitle>
              <CardDescription>Organize your figures with a visual kanban board</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-filter backdrop-blur-sm border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <BarChart className="h-8 w-8 text-kanban-dev mb-2" />
              <CardTitle>Report Generation</CardTitle>
              <CardDescription>Generate professional reports with your figures</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-filter backdrop-blur-sm border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CheckCircle2 className="h-8 w-8 text-kanban-testing mb-2" />
              <CardTitle>Project Tracking</CardTitle>
              <CardDescription>Track project progress from start to finish</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs 
          defaultValue="bulk" 
          className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl border border-slate-200 p-6"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid grid-cols-2 mb-6 p-1 bg-slate-100 rounded-lg">
            <TabsTrigger value="bulk" className="text-lg py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 rounded-md">
              <FileUp className="mr-2 h-5 w-5" />
              Bulk Upload
            </TabsTrigger>
            <TabsTrigger value="label" className="text-lg py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 rounded-md">
              <Tag className="mr-2 h-5 w-5" />
              Label-Based Upload
            </TabsTrigger>
          </TabsList>
          
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
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-300">© 2025 Figure Management System for Consultants</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
