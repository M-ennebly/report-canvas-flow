
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Info, Calendar } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ReportProjectOverviewProps {
  description: string;
}

const ReportProjectOverview = ({ description }: ReportProjectOverviewProps) => {
  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Card className="mb-8 overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white pb-6 border-b">
        <div className="flex items-center mb-2">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle>Project Overview</CardTitle>
        </div>
        <div className="flex items-center text-sm text-slate-500 mt-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Generated on {currentDate}</span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {description ? (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">{description}</p>
            <div className="flex items-start pt-4 border-t border-slate-100">
              <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-500">
                This overview provides context for the project and summarizes its objectives and scope.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-6 text-slate-400 bg-slate-50 rounded-md">
            <Info className="h-5 w-5 mr-2" />
            <p>No project description available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportProjectOverview;
