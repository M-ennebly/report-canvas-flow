
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileUp, Tag } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center space-y-8 px-4 max-w-3xl">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
            Figure Management for Consultants
          </h1>
          <p className="text-xl text-slate-600">
            Streamline your report creation by organizing figures from documents into a structured workflow
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-200 flex flex-col items-center space-y-4">
            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
              <FileUp className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800">Bulk Upload Project</h2>
            <p className="text-slate-600">
              Upload multiple documents at once and organize extracted figures across all workflow stages
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/bulk-upload")}
              className="mt-4 w-full"
            >
              Start Bulk Upload
            </Button>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-200 flex flex-col items-center space-y-4">
            <div className="h-16 w-16 bg-purple-50 rounded-full flex items-center justify-center">
              <Tag className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800">Label-Based Upload</h2>
            <p className="text-slate-600">
              Select specific workflow stages and upload documents directly to those stages
            </p>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate("/label-upload")}
              className="mt-4 w-full"
            >
              Start Label-Based Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
