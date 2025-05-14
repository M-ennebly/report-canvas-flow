
import { BarChart, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UploadInfoBoxProps {
  onSelectFilesClick: () => void;
}

const UploadInfoBox = ({ onSelectFilesClick }: UploadInfoBoxProps) => {
  const navigate = useNavigate();

  return (
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
              onClick={onSelectFilesClick}
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
  );
};

export default UploadInfoBox;
