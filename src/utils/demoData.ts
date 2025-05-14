
import { Task } from "@/types";

// Helper function to get a weighted distribution of tasks for each column
export const generateDemoTasks = (
  focusLabel?: string,
  selectedLabels: string[] = []
): Task[] => {
  // Default distribution if no specific label is targeted
  let columnWeights = {
    design: 0.25,
    analyse: 0.25,
    dev: 0.25,
    testing: 0.25,
  };

  // If we have a specific label focus, adjust weights
  if (focusLabel) {
    const focusWeight = 0.5; // 50% of tasks in the focus column
    const otherWeight = (1 - focusWeight) / 3; // Distribute the rest

    columnWeights = {
      design: focusLabel === "design" ? focusWeight : otherWeight,
      analyse: focusLabel === "analyse" ? focusWeight : otherWeight,
      dev: focusLabel === "dev" ? focusWeight : otherWeight,
      testing: focusLabel === "testing" ? focusWeight : otherWeight,
    };
  } 
  // If multiple labels are selected, distribute tasks among them
  else if (selectedLabels && selectedLabels.length > 0) {
    const focusWeight = 0.8; // 80% of tasks in the selected columns
    const selectedWeight = focusWeight / selectedLabels.length; // Evenly distribute among selected
    const otherWeight = (1 - focusWeight) / (4 - selectedLabels.length); // Rest for other columns

    columnWeights = {
      design: selectedLabels.includes("design") ? selectedWeight : otherWeight,
      analyse: selectedLabels.includes("analyse") ? selectedWeight : otherWeight,
      dev: selectedLabels.includes("dev") ? selectedWeight : otherWeight,
      testing: selectedLabels.includes("testing") ? selectedWeight : otherWeight,
    };
  }

  // Generate demo tasks with appropriate distribution
  const tasks: Task[] = [];
  const taskTypes = ["table", "chart", "diagram", "image"];
  const totalTasks = 16; // Total number of tasks to generate

  Object.entries(columnWeights).forEach(([column, weight]) => {
    const columnCount = Math.round(totalTasks * weight);
    
    for (let i = 0; i < columnCount; i++) {
      const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
      const taskId = `task-${column}-${i}`;
      
      tasks.push({
        id: taskId,
        title: `${taskType.charAt(0).toUpperCase() + taskType.slice(1)} ${i + 1}`,
        description: `Demo ${taskType} for ${column} phase.`,
        column: column as "design" | "analyse" | "dev" | "testing",
        type: taskType as "table" | "chart" | "diagram" | "image",
        sourceDocument: `Document ${Math.floor(Math.random() * 3) + 1}`,
        imageUrl: "/placeholder.svg"
      });
    }
  });

  return tasks;
};
