
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

const LabelUpload = () => {
  const navigate = useNavigate();
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const labels = [
    { id: "design", name: "Design", color: "bg-kanban-design" },
    { id: "analyse", name: "Analyse", color: "bg-kanban-analyse" },
    { id: "dev", name: "Dev", color: "bg-kanban-dev" },
    { id: "testing", name: "Testing", color: "bg-kanban-testing" }
  ];

  const handleLabelSelect = (labelId: string) => {
    setSelectedLabel(labelId);
  };

  const handleUpload = () => {
    if (!selectedLabel) {
      toast.error("Please select a label first");
      return;
    }
    
    // In a real application, we would handle file uploads here
    toast.success("Files uploaded successfully");
    
    // Redirect to workspace with the selected label
    navigate(`/workspace/label/${selectedLabel}`);
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
            
            <div className="mt-8 flex justify-end">
              <Button 
                disabled={!selectedLabel}
                onClick={handleUpload}
              >
                Continue to Upload
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabelUpload;
