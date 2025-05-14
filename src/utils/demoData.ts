
import { Task } from "@/types";
import { figureImages } from "./figureImages";
import { almondTasksData } from "./almondTasksData";
import { taskTitles, figureTitles } from "./fallbackTaskData";

// Generate demo tasks based on the selected labels
export const generateDemoTasks = (
  labelId?: string, 
  selectedLabels: string[] = []
): Task[] => {
  const tasks: Task[] = [];
  const columns = labelId 
    ? [labelId] 
    : selectedLabels.length > 0 
      ? selectedLabels 
      : ["design", "analyse", "dev", "testing"];

  columns.forEach(column => {
    // Use predefined almond processing data
    const columnData = almondTasksData[column as keyof typeof almondTasksData];
    
    if (columnData) {
      columnData.forEach((taskData, taskIndex) => {
        const taskId = `task-${column}-${taskIndex}`;
        const category = taskData.category || "fallback";
        const categoryImages = figureImages[category as keyof typeof figureImages] || figureImages.fallback;
        
        const figures = taskData.figures.map((figureData, figureIndex) => ({
          id: `figure-${column}-${taskIndex}-${figureIndex}`,
          title: figureData.title,
          description: figureData.description,
          imageUrl: categoryImages[figureIndex % categoryImages.length],
          pageNumber: Math.floor(Math.random() * 20) + 1,
        }));
        
        tasks.push({
          id: taskId,
          title: taskData.title,
          figures: figures,
          column: column as "design" | "analyse" | "dev" | "testing",
        });
      });
    } else {
      // Fallback to the old random generation logic
      const taskCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < taskCount; i++) {
        const titles = taskTitles[column as keyof typeof taskTitles];
        const title = titles[Math.floor(Math.random() * titles.length)];
        
        const figureCount = Math.floor(Math.random() * 4) + 1;
        const figures = [];
        
        for (let j = 0; j < figureCount; j++) {
          const figureTitle = figureTitles[column as keyof typeof figureTitles][j % 4];
          
          figures.push({
            id: `figure-${column}-${i}-${j}`,
            title: figureTitle,
            description: `Description for ${figureTitle}`,
            imageUrl: figureImages.fallback[Math.floor(Math.random() * figureImages.fallback.length)],
            pageNumber: Math.floor(Math.random() * 20) + 1,
          });
        }
        
        const taskId = `task-${column}-${i}`;
        tasks.push({
          id: taskId,
          title: title,
          figures: figures,
          column: column as "design" | "analyse" | "dev" | "testing",
        });
      }
    }
  });

  return tasks;
};
