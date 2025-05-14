
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import WorkspaceContent from "@/components/workspace/WorkspaceContent";

const Workspace = () => {
  const { uploadType, labelId } = useParams<{ uploadType: string; labelId?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // If coming from label-based upload, set up the appropriate view
    if (uploadType === "label" && labelId) {
      toast.success(`Ready to upload files for the ${labelId.charAt(0).toUpperCase() + labelId.slice(1)} stage`);
    }
  }, [uploadType, labelId]);

  const handleGenerateReport = () => {
    navigate(`/report/demo-project`);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-slate-100">
      <WorkspaceHeader 
        projectName="Consultant Report Project"
        labelId={labelId}
        onGenerateReport={handleGenerateReport}
      />
      <WorkspaceContent labelId={labelId} />
    </div>
  );
};

export default Workspace;
