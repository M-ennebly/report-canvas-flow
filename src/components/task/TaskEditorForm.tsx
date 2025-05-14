
import React from "react";
import { Task } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskEditorFormProps {
  task: Task;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onColumnChange: (value: string) => void;
}

const TaskEditorForm: React.FC<TaskEditorFormProps> = ({
  task,
  onTitleChange,
  onColumnChange,
}) => {
  // Column display names
  const columnNames = {
    design: "Design",
    analyse: "Analysis",
    dev: "Development",
    testing: "Testing"
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Task Title</label>
        <Input
          value={task.title}
          onChange={onTitleChange}
          className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          placeholder="Enter task title"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Task Column/Label</label>
        <Select
          value={task.column}
          onValueChange={onColumnChange}
        >
          <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="design" className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-rose-500 mr-2"></span>
              {columnNames.design}
            </SelectItem>
            <SelectItem value="analyse" className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              {columnNames.analyse}
            </SelectItem>
            <SelectItem value="dev" className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
              {columnNames.dev}
            </SelectItem>
            <SelectItem value="testing" className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
              {columnNames.testing}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TaskEditorForm;
