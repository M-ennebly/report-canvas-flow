
import { Task } from "@/types";

// Sample image URLs for figures
const figureImages = [
  "/placeholder.svg",
  "https://source.unsplash.com/random/800x600/?chart",
  "https://source.unsplash.com/random/800x600/?graph",
  "https://source.unsplash.com/random/800x600/?diagram",
  "https://source.unsplash.com/random/800x600/?data"
];

// Task titles by category
const taskTitles = {
  design: [
    "Design the user flow for mobile app",
    "Create wireframes for dashboard",
    "Visual design for landing page",
    "UI component system design"
  ],
  analyse: [
    "Market growth analysis",
    "Customer segmentation report",
    "Competitive landscape review",
    "ROI analysis for product features"
  ],
  dev: [
    "Implement authentication system",
    "Build analytics dashboard",
    "Create API integration layer",
    "Develop mobile notification service"
  ],
  testing: [
    "User acceptance test plan",
    "Performance benchmarking",
    "Security vulnerability assessment",
    "Cross-platform compatibility testing"
  ]
};

// Figure titles by category
const figureTitles = {
  design: [
    "User Flow Diagram", 
    "Wireframe Layout", 
    "Color Scheme Palette", 
    "Component Library"
  ],
  analyse: [
    "Market Share Graph", 
    "Customer Demographics", 
    "Competitor Comparison", 
    "Trend Analysis Chart"
  ],
  dev: [
    "System Architecture", 
    "Database Schema", 
    "API Endpoints", 
    "Service Integration Map"
  ],
  testing: [
    "Test Coverage Report", 
    "Performance Metrics", 
    "Error Rate Analysis", 
    "User Feedback Summary"
  ]
};

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
    // Generate 1-3 tasks per column
    const taskCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < taskCount; i++) {
      // Get a random title for this column type
      const titles = taskTitles[column as keyof typeof taskTitles];
      const title = titles[Math.floor(Math.random() * titles.length)];
      
      // Generate a random figure count (1-4)
      const figureCount = Math.floor(Math.random() * 4) + 1;
      const figures = [];
      
      // Create figures for this task
      for (let j = 0; j < figureCount; j++) {
        const figureTitle = figureTitles[column as keyof typeof figureTitles][j % 4];
        
        figures.push({
          id: `figure-${column}-${i}-${j}`,
          title: figureTitle,
          description: `Description for ${figureTitle}`,
          imageUrl: figureImages[Math.floor(Math.random() * figureImages.length)],
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
  });

  return tasks;
};
