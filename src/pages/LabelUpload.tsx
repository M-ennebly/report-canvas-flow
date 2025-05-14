
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, FileUp, X } from "lucide-react";
import { toast } from "sonner";

const LabelUpload = () => {
  const navigate = useNavigate();
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasUploadedFiles, setHasUploadedFiles] = useState(false);

  const labels = [
    { id: "design", name: "Design", color: "bg-kanban-design" },
    { id: "analyse", name: "Analyse", color: "bg-kanban-analyse" },
    { id: "dev", name: "Dev", color: "bg-kanban-dev" },
    { id: "testing", name: "Testing", color: "bg-kanban-testing" }
  ];

  const handleLabelSelect = (labelId: string) => {
    setSelectedLabel(labelId);
    setIsDialogOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setHasUploadedFiles(true);
      toast.success(`${e.target.files.length} document(s) selected`);
    }
  };
  
  const handleUpload = () => {
    if (!selectedLabel) {
      toast.error("Please select a label first");
      return;
    }
    
    // In a real application, we would handle the file upload here
    toast.success("Files uploaded successfully");
    
    // Redirect to workspace with the selected label
    navigate(`/workspace/label/${selectedLabel}`);
  };

  const handleCancel = () => {
    setSelectedLabel(null);
    setIsDialogOpen(false);
    setHasUploadedFiles(false);
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
            <CardTitle className="text-2xl">Select a Label</CardTitle>
            <CardDescription>
              Choose which workflow stage to upload your documents to
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {labels.map((label) => (
                <div
                  key={label.id}
                  className={`
                    cursor-pointer p-6 rounded-lg border-2 flex flex-col items-center justify-center
                    ${selectedLabel === label.id ? "border-blue-500" : "border-transparent"}
                    hover:border-blue-300 transition-all
                  `}
                  onClick={() => handleLabelSelect(label.id)}
                >
                  <div className={`w-full h-2 ${label.color} rounded-full mb-3`}></div>
                  <span className="font-medium">{label.name}</span>
                  {selectedLabel === label.id && (
                    <Check className="text-blue-500 mt-2 h-5 w-5" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Documents to {labels.find(l => l.id === selectedLabel)?.name}</DialogTitle>
            <DialogDescription>
              The uploaded documents will be processed and figures will be added to the {labels.find(l => l.id === selectedLabel)?.name} column.
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
          </div>
          
          <DialogFooter className="flex flex-row justify-between">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button 
              onClick={handleUpload}
              disabled={!hasUploadedFiles}
            >
              Upload and View Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabelUpload;
