import { Figure, Task } from "@/types";

export function generateDemoTasks(selectedLabel?: string): Task[] {
  // Generate demo tasks based on the selected label or create demo tasks for all columns
  const demoFigures = [
    { id: "fig1", title: "Market Segmentation", description: "Shows the breakdown of market segments", imageUrl: "https://picsum.photos/seed/chart1/300/200" },
    { id: "fig2", title: "Customer Journey", description: "Visualization of the customer journey process", imageUrl: "https://picsum.photos/seed/chart2/300/200" },
    { id: "fig3", title: "Product Architecture", description: "High-level product architecture", imageUrl: "https://picsum.photos/seed/chart3/300/200" },
    { id: "fig4", title: "Roadmap Timeline", description: "Timeline for product development", imageUrl: "https://picsum.photos/seed/chart4/300/200" },
    { id: "fig5", title: "Team Structure", description: "Organization chart for the project team", imageUrl: "https://picsum.photos/seed/chart5/300/200" },
    { id: "fig6", title: "Budget Allocation", description: "Budget breakdown by department", imageUrl: "https://picsum.photos/seed/chart6/300/200" },
  ];

  if (selectedLabel) {
    // If coming from label-based upload, just create tasks in that column
    return [
      {
        id: "task1",
        title: "Main Project Tasks",
        figures: demoFigures.slice(0, 3),
        column: selectedLabel as "design" | "analyse" | "dev" | "testing",
      }
    ];
  }

  // Otherwise create demo tasks for all columns
  return [
    {
      id: "task1",
      title: "Design System Architecture",
      figures: [demoFigures[0], demoFigures[1]],
      column: "design",
    },
    {
      id: "task2",
      title: "Market Analysis Report",
      figures: [demoFigures[2]],
      column: "analyse",
    },
    {
      id: "task3",
      title: "Develop Customer Portal",
      figures: [demoFigures[3], demoFigures[4]],
      column: "dev",
    },
    {
      id: "task4",
      title: "Test User Authentication",
      figures: [demoFigures[5]],
      column: "testing",
    },
  ];
}
