
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
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);
  
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
    
    setSelectedFiles(files);
    setUploadedDocuments(newDocs);
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
    
    setSelectedFiles(files);
    setUploadedDocuments(newDocs);
    
    if (!selectedLabels.includes(labelId)) {
      setSelectedLabels([...selectedLabels, labelId]);
    }
    toast.success(`${files.length} document(s) selected for ${labelId}`);
  };

  const handleProcessFiles = (uploadType: 'bulk' | 'label') => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    if (uploadType === 'label' && selectedLabels.length === 0) {
      toast.error("Please select at least one label");
      return;
    }

    setIsLoading(true);

    // Store the documents in sessionStorage
    sessionStorage.setItem('uploadedDocuments', JSON.stringify(uploadedDocuments));
    
    if (uploadType === 'label') {
      sessionStorage.setItem('selectedLabels', JSON.stringify(selectedLabels));
      navigate(`/workspace/label/${selectedLabels[0]}`);
    } else {
      navigate("/workspace/bulk");
    }
  };

  const removeDocument = (docId: string) => {
    setUploadedDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
    
    // If we've removed all documents, clear the selected files
    if (uploadedDocuments.length <= 1) {
      setSelectedFiles(null);
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

        <Tabs defaultValue="bulk" className="max-w-5xl mx-auto">
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
                  selectedFiles={selectedFiles}
                  uploadedDocuments={uploadedDocuments}
                  isLoading={isLoading}
                  onFilesSelected={handleBulkUpload}
                  onRemoveDocument={removeDocument}
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
                  selectedFiles={selectedFiles}
                  selectedLabels={selectedLabels}
                  uploadedDocuments={uploadedDocuments}
                  isLoading={isLoading}
                  onLabelUpload={handleLabelUpload}
                  onRemoveDocument={removeDocument}
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
