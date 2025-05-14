
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileUp, Tag, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import UploadDropzone from "@/components/upload/UploadDropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document } from "@/types";

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
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-slate-800">Upload Multiple Documents</h2>
                  <p className="text-slate-600">
                    Upload documents and extract figures across all workflow stages
                  </p>
                  
                  <UploadDropzone 
                    onFilesSelected={handleBulkUpload}
                    selectedFiles={selectedFiles}
                  />
                  
                  {/* Document preview list */}
                  {uploadedDocuments.length > 0 && (
                    <div className="mt-6 border rounded-md p-4 bg-white">
                      <h3 className="font-medium mb-2">Selected Documents:</h3>
                      <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {uploadedDocuments.map(doc => (
                          <li key={doc.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center mr-2 text-xs">
                                {doc.type.toUpperCase()}
                              </div>
                              <span className="truncate">{doc.name}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-slate-500 hover:text-red-500"
                              onClick={() => removeDocument(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-6">
                    <Button 
                      onClick={() => handleProcessFiles('bulk')}
                      disabled={!selectedFiles || isLoading}
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Process and Extract Figures"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="label">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-slate-800">Upload to Specific Workflow Stages</h2>
                  <p className="text-slate-600">
                    Select specific workflow stages and upload documents directly to those stages
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {labels.map((label) => (
                      <div key={label.id} className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 ${label.color} rounded-full`}></div>
                          <h3 className="font-medium">{label.name}</h3>
                        </div>
                        <UploadDropzone
                          onFilesSelected={(files) => handleLabelUpload(files, label.id)}
                          selectedFiles={selectedLabels.includes(label.id) ? selectedFiles : null}
                          height="small"
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Document preview list for label upload */}
                  {uploadedDocuments.length > 0 && (
                    <div className="mt-6 border rounded-md p-4 bg-white">
                      <h3 className="font-medium mb-2">Selected Documents:</h3>
                      <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {uploadedDocuments.map(doc => (
                          <li key={doc.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center mr-2 text-xs">
                                {doc.type.toUpperCase()}
                              </div>
                              <span className="truncate">{doc.name}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-slate-500 hover:text-red-500"
                              onClick={() => removeDocument(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-6">
                    <Button 
                      onClick={() => handleProcessFiles('label')}
                      disabled={!selectedFiles || selectedLabels.length === 0 || isLoading}
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Process and Extract Figures"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LandingPage;
