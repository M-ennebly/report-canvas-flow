
import React from "react";
import { Task } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ListViewProps {
  tasks: Task[];
  columns: { id: string; title: string }[];
  onTaskClick: (taskId: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ tasks, columns, onTaskClick }) => {
  // Group tasks by column
  const tasksByColumn = columns.map(column => ({
    ...column,
    tasks: tasks.filter(task => task.column === column.id)
  }));

  const getColumnColorClass = (columnId: string) => {
    switch (columnId) {
      case "design": return "bg-kanban-design text-white";
      case "analyse": return "bg-kanban-analyse text-white";
      case "dev": return "bg-kanban-dev text-white";
      case "testing": return "bg-kanban-testing text-white";
      default: return "bg-slate-200";
    }
  };

  return (
    <div className="space-y-8">
      {tasksByColumn.map(column => (
        <div key={column.id} className="space-y-4">
          <div className={`px-4 py-2 rounded-md inline-flex items-center ${getColumnColorClass(column.id)}`}>
            <h3 className="font-medium">{column.title}</h3>
            <span className="ml-2 bg-white bg-opacity-30 px-2 py-0.5 rounded text-sm">
              {column.tasks.length}
            </span>
          </div>
          
          {column.tasks.length > 0 ? (
            <div className="space-y-4">
              {column.tasks.map(task => (
                <Card 
                  key={task.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onTaskClick(task.id)}
                >
                  <CardContent className="p-4">
                    <div className="mb-3 pb-2 border-b">
                      <div className="text-xs text-slate-500 uppercase tracking-wider">Task</div>
                      <h4 className="text-lg font-medium">{task.title}</h4>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Figures</span>
                        <span className="text-xs font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                          {task.figures.length}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {task.figures.map(figure => (
                          <div key={figure.id} className="space-y-1">
                            <AspectRatio ratio={16/9} className="overflow-hidden rounded bg-slate-100">
                              <img 
                                src={figure.imageUrl} 
                                alt={figure.title}
                                className="w-full h-full object-cover"
                              />
                            </AspectRatio>
                            <p className="text-xs truncate">{figure.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
              No tasks in this column
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListView;
