import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, FileUp, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const LabelUpload = () => {
  const navigate = useNavigate();
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const labels = [
    { id: "design", name: "Design", color: "bg-kanban-design" },
    { id: "analyse", name: "Analyse", color: "bg-kanban-analyse" },
    { id: "dev", name: "Dev", color: "bg-kanban-dev" },
    { id: "testing", name: "Testing", color: "bg-kanban-testing" }
  ];

  const handleLabelToggle = (labelId: string) => {
    setSelectedLabels(prev => {
      if (prev.includes(labelId)) {
        return prev.filter(id => id !== labelId);
      } else {
        return [...prev, labelId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedLabels.length === 0) {
      toast.error("Please select at least one label");
      return;
    }
    
    setIsDialogOpen(true);
  };

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
      // Store files and selected labels in session storage
      const filesArray = Array.from(selectedFiles).map(file => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.name.split(".").pop() || "unknown",
        url: URL.createObjectURL(file),
        dateUploaded: new Date().toISOString(),
      }));

      sessionStorage.setItem('uploadedDocuments', JSON.stringify(filesArray));
      sessionStorage.setItem('selectedLabels', JSON.stringify(selectedLabels));
      
      // Navigate to workspace with the primary selected label
      // Other labels will be used in the workspace
      navigate(`/workspace/label/${selectedLabels[0]}`);
    }, 2000);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
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
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Select Labels</CardTitle>
            <CardDescription>
              Choose which workflow stages to upload your documents to (select one or more)
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {labels.map((label) => (
                <div
                  key={label.id}
                  className={`
                    cursor-pointer p-6 rounded-lg border-2 flex flex-col items-center justify-center
                    ${selectedLabels.includes(label.id) ? "border-blue-500" : "border-transparent"}
                    hover:border-blue-300 transition-all
                  `}
                  onClick={() => handleLabelToggle(label.id)}
                >
                  <div className={`w-full h-2 ${label.color} rounded-full mb-3`}></div>
                  <span className="font-medium">{label.name}</span>
                  <div className="mt-2 flex items-center justify-center">
                    <Checkbox
                      checked={selectedLabels.includes(label.id)}
                      onCheckedChange={() => handleLabelToggle(label.id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button 
                onClick={handleContinue}
                disabled={selectedLabels.length === 0}
              >
                Continue to Upload
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="mt-6">
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Processing your documents</h3>
                  <p className="text-muted-foreground">
                    We're extracting figures and organizing them into the selected workflow stages. This may take a moment...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Documents to Selected Labels</DialogTitle>
            <DialogDescription>
              The uploaded documents will be processed and figures will be added to the following stages: {selectedLabels.map(id => labels.find(l => l.id === id)?.name).join(", ")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center space-y-2 my-4">
            <FileUp className="mx-auto h-8 w-8 text-slate-400" />
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
                className="mt-2 w-full"
                asChild
              >
                <span>Select Files</span>
              </Button>
            </label>

            {selectedFiles && (
              <div className="mt-4 text-sm text-left">
                <p className="font-medium mb-2">{selectedFiles.length} file(s) selected:</p>
                <ul className="list-disc pl-5 max-h-32 overflow-y-auto">
                  {Array.from(selectedFiles).map((file, index) => (
                    <li key={index} className="truncate">{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-row justify-between">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button 
              onClick={handleProcessFiles}
              disabled={!selectedFiles || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process and View Workspace"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabelUpload;
