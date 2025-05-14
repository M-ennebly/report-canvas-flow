
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const BulkUpload = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
      toast.success(`${e.target.files.length} document(s) selected`);
    }
  };

  const handleProcessFiles = () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    setIsLoading(true);

    // Simulate processing time (in a real app, this would be an API call)
    setTimeout(() => {
      // Store files in session storage to be accessed in the workspace
      const filesArray = Array.from(selectedFiles).map(file => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.name.split(".").pop() || "unknown",
        url: URL.createObjectURL(file),
        dateUploaded: new Date().toISOString(),
      }));

      sessionStorage.setItem('uploadedDocuments', JSON.stringify(filesArray));
      
      // Navigate to workspace
      navigate("/workspace/bulk");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex flex-col">
      <div className="max-w-4xl mx-auto w-full">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Bulk Upload</CardTitle>
            <CardDescription>
              Upload multiple documents at once and automatically extract figures across all workflow stages
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center space-y-4 my-4">
              <FileUp className="mx-auto h-12 w-12 text-slate-400" />
              <p className="text-slate-500">Upload PDF, DOCX or PPT files</p>
              <label>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.ppt,.pptx"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full max-w-md mx-auto"
                  asChild
                >
                  <span>Select Files</span>
                </Button>
              </label>
              
              {selectedFiles && (
                <div className="mt-4 text-sm text-left max-w-md mx-auto">
                  <p className="font-medium mb-2">{selectedFiles.length} file(s) selected:</p>
                  <ul className="list-disc pl-5">
                    {Array.from(selectedFiles).map((file, index) => (
                      <li key={index} className="truncate">{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                onClick={handleProcessFiles}
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
          </CardContent>
        </Card>

        {isLoading && (
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Processing your documents</h3>
                  <p className="text-muted-foreground">
                    We're extracting figures and organizing them into the workflow. This may take a moment...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;
