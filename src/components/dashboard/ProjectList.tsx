
import ProjectCard from "./ProjectCard";

const demoProjects = [
  {
    id: "proj-1",
    name: "Client A Insurance Claim",
    lastUpdated: "May 12, 2025",
    status: "Completed" as const,
    hasReport: true,
  },
  {
    id: "proj-2",
    name: "Client B Documentation",
    lastUpdated: "May 10, 2025",
    status: "In Progress" as const,
    hasReport: true,
  },
  {
    id: "proj-3",
    name: "Client C Analysis",
    lastUpdated: "May 8, 2025",
    status: "Draft" as const,
    hasReport: false,
  },
];

const ProjectList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {demoProjects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
};

export default ProjectList;
