
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUp, Tag } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    setBulkDocuments(newDocs);
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
    }));
    
    setLabelFiles(files);
    setLabelDocuments(newDocs);
    
    if (!selectedLabels.includes(labelId)) {
      setSelectedLabels([...selectedLabels, labelId]);
    }
    toast.success(`${files.length} document(s) selected for ${labelId}`);
  };

  const handleProcessFiles = (uploadType: 'bulk' | 'label') => {
    if (uploadType === 'bulk' && (!bulkFiles || bulkFiles.length === 0)) {
      toast.error("Please select at least one file to upload");
      return;
    }

    if (uploadType === 'label' && (!labelFiles || labelFiles.length === 0)) {
      toast.error("Please select at least one file to upload");
      return;
    }

    if (uploadType === 'label' && selectedLabels.length === 0) {
      toast.error("Please select at least one label");
      return;
    }

    setIsLoading(true);

    // Store the appropriate documents in sessionStorage
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
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
            Figure Management for Consultants
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Streamline your report creation by organizing figures from documents into a structured workflow
          </p>
        </div>

        <Tabs 
          defaultValue="bulk" 
          className="max-w-5xl mx-auto"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="bulk" className="text-lg py-3">
              <FileUp className="mr-2 h-5 w-5" />
              Bulk Upload
            </TabsTrigger>
            <TabsTrigger value="label" className="text-lg py-3">
              <Tag className="mr-2 h-5 w-5" />
              Label-Based Upload
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bulk">
            <Card>
              <CardContent className="p-6">
                <BulkUploadTab 
                  selectedFiles={bulkFiles}
                  uploadedDocuments={bulkDocuments}
                  isLoading={isLoading}
                  onFilesSelected={handleBulkUpload}
                  onRemoveDocument={removeBulkDocument}
                  onProcess={() => handleProcessFiles('bulk')}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="label">
            <Card>
              <CardContent className="p-6">
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LandingPage;
