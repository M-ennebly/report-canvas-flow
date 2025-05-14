
import { Task } from "@/types";
import ReportTaskCard from "./ReportTaskCard";

interface ReportColumnSectionProps {
  columnName: string;
  tasks: Task[];
}

const ReportColumnSection = ({ columnName, tasks }: ReportColumnSectionProps) => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{columnName}</h2>
      
      {tasks.map((task) => (
        <ReportTaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default ReportColumnSection;
