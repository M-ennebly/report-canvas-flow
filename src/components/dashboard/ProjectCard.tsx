
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  name: string;
  lastUpdated: string;
  status: "Draft" | "In Progress" | "Completed";
  hasReport: boolean;
}

const ProjectCard = ({ id, name, lastUpdated, status, hasReport }: ProjectCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = () => {
    switch (status) {
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {status}
            </div>
          </div>
          <p className="text-sm text-slate-500">Last updated: {lastUpdated}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-slate-50 gap-2 flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/workspace/bulk?projectId=${id}`)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasReport}
          onClick={() => hasReport && navigate(`/report/${id}`)}
        >
          <ArrowRight className="h-4 w-4 mr-1" />
          View Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
