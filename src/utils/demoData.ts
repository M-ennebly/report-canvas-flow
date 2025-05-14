
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

  // Available image categories
  const allCategories = Object.keys(figureImages);
  
  // Generate more tasks per column
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
      
      // Add additional tasks with new image categories
      const additionalTaskCount = Math.floor(Math.random() * 3) + 2; // 2-4 more tasks
      
      for (let i = 0; i < additionalTaskCount; i++) {
        const taskId = `task-extra-${column}-${i}`;
        const titles = taskTitles[column as keyof typeof taskTitles];
        const title = titles[Math.floor(Math.random() * titles.length)];
        
        // Use random category from new ones
        const newCategories = ["machines", "reports", "diagrams", "engineering", "process"];
        const category = newCategories[Math.floor(Math.random() * newCategories.length)];
        const categoryImages = figureImages[category as keyof typeof figureImages];
        
        // Generate 3-7 figures
        const figureCount = Math.floor(Math.random() * 5) + 3;
        const figures = [];
        
        for (let j = 0; j < figureCount; j++) {
          const figureTitle = `${category.charAt(0).toUpperCase() + category.slice(1)} Figure ${j + 1}`;
          
          figures.push({
            id: `figure-extra-${column}-${i}-${j}`,
            title: figureTitle,
            description: `Description for ${figureTitle} - This is a detailed visualization related to the ${category} category.`,
            imageUrl: categoryImages[j % categoryImages.length],
            pageNumber: Math.floor(Math.random() * 20) + 1,
          });
        }
        
        tasks.push({
          id: taskId,
          title: `${title} - ${category.charAt(0).toUpperCase() + category.slice(1)}`,
          figures: figures,
          column: column as "design" | "analyse" | "dev" | "testing",
        });
      }
    } else {
      // Fallback to the old random generation logic with more tasks
      const taskCount = Math.floor(Math.random() * 4) + 3; // 3-6 tasks
      
      for (let i = 0; i < taskCount; i++) {
        const titles = taskTitles[column as keyof typeof taskTitles];
        const title = titles[Math.floor(Math.random() * titles.length)];
        
        // Random category from all available
        const category = allCategories[Math.floor(Math.random() * allCategories.length)];
        const categoryImages = figureImages[category as keyof typeof figureImages];
        
        const figureCount = Math.floor(Math.random() * 5) + 2; // 2-6 figures
        const figures = [];
        
        for (let j = 0; j < figureCount; j++) {
          const figureTitle = figureTitles[column as keyof typeof figureTitles][j % 4];
          
          figures.push({
            id: `figure-${column}-${i}-${j}`,
            title: figureTitle,
            description: `Description for ${figureTitle} - From the ${category} category`,
            imageUrl: categoryImages ? categoryImages[j % categoryImages.length] : figureImages.fallback[j % figureImages.fallback.length],
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
