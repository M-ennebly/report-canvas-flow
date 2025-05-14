
import { Project, Task } from "@/types";
import { toast } from "sonner";

export const createTaskActions = (
  project: Project,
  setProject: React.Dispatch<React.SetStateAction<Project>>
) => {
  const handleTaskMove = (taskId: string, sourceColumn: string, targetColumn: string) => {
    setProject({
      ...project,
      tasks: project.tasks.map((task) =>
        task.id === taskId
          ? { ...task, column: targetColumn as "design" | "analyse" | "dev" | "testing" }
          : task
      ),
    });
    toast.success(`Task moved to ${targetColumn}`);
  };

  const handleDeleteTask = (taskId: string) => {
    setProject({
      ...project,
      tasks: project.tasks.filter(task => task.id !== taskId)
    });
    toast.success("Task deleted");
  };

  const handleDeleteFigure = (taskId: string, figureId: string) => {
    setProject({
      ...project,
      tasks: project.tasks.map(task => 
        task.id === taskId 
          ? { ...task, figures: task.figures.filter(figure => figure.id !== figureId) }
          : task
      )
    });
    toast.success("Figure deleted");
  };

  const handleSaveTask = (updatedTask: Task) => {
    setProject({
      ...project,
      tasks: project.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    });
  };

  return {
    handleTaskMove,
    handleDeleteTask,
    handleDeleteFigure,
    handleSaveTask
  };
};
