
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/types";
import ReportFigure from "./ReportFigure";

interface ReportTaskCardProps {
  task: Task;
}

const ReportTaskCard = ({ task }: ReportTaskCardProps) => {
  return (
    <Card id={`task-${task.id}`} className="mb-8 scroll-mt-24">
      <CardHeader className="border-b">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 ${
            task.column === "design" ? "bg-kanban-design" : 
            task.column === "analyse" ? "bg-kanban-analyse" : 
            task.column === "dev" ? "bg-kanban-dev" : "bg-kanban-testing"
          }`}></div>
          <CardTitle>{task.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {task.figures.length > 0 ? (
          <div className="space-y-8">
            {task.figures.map((figure) => (
              <ReportFigure key={figure.id} figure={figure} />
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No figures available for this task.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportTaskCard;
