
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, Tag } from "lucide-react";
import BulkUploadTab from "@/components/upload/BulkUploadTab";
import LabelUploadTab from "@/components/upload/LabelUploadTab";
import UploadInfoBox from "@/components/upload/UploadInfoBox";
import { Document } from "@/types";

interface EnhancedUploadSectionProps {
  bulkFiles: FileList | null;
  setBulkFiles: (files: FileList | null) => void;
  bulkDocuments: Document[];
  setBulkDocuments: (docs: Document[]) => void;
  labelFiles: FileList | null;
  setLabelFiles: (files: FileList | null) => void;
  labelDocuments: Document[];
  setLabelDocuments: (docs: Document[]) => void;
  isLoading: boolean;
  selectedLabels: string[];
  setSelectedLabels: (labels: string[]) => void;
  handleBulkUpload: (files: FileList) => void;
  handleLabelUpload: (files: FileList, labelId: string) => void;
  handleProcessFiles: (uploadType: 'bulk' | 'label') => void;
  removeBulkDocument: (docId: string) => void;
  removeLabelDocument: (docId: string) => void;
}

const EnhancedUploadSection = ({
  bulkFiles,
  bulkDocuments,
  labelFiles,
  labelDocuments,
  isLoading,
  selectedLabels,
  handleBulkUpload,
  handleLabelUpload,
  handleProcessFiles,
  removeBulkDocument,
  removeLabelDocument
}: EnhancedUploadSectionProps) => {
  const [activeTab, setActiveTab] = useState<string>("bulk");
  
  const labels = [
    { id: "design", name: "Design", color: "bg-kanban-design" },
    { id: "analyse", name: "Analyse", color: "bg-kanban-analyse" },
    { id: "dev", name: "Dev", color: "bg-kanban-dev" },
    { id: "testing", name: "Testing", color: "bg-kanban-testing" }
  ];

  const handleSelectFilesClick = () => {
    // Using a type-safe way to select and click the file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
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
            <TabsList className="grid grid-cols-2 gap-2 p-1 bg-white rounded-lg">
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

            <UploadInfoBox onSelectFilesClick={handleSelectFilesClick} />
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default EnhancedUploadSection;
