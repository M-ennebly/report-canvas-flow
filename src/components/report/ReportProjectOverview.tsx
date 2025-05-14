
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportProjectOverviewProps {
  description: string;
}

const ReportProjectOverview = ({ description }: ReportProjectOverviewProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description || "No project description available."}</p>
      </CardContent>
    </Card>
  );
};

export default ReportProjectOverview;
