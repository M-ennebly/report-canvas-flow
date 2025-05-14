
// Utility functions for TreeView component
export const getColumnDisplayName = (
  columnId: string, 
  columns: { id: string; title: string }[]
) => {
  const column = columns.find(c => c.id === columnId);
  return column ? column.title : columnId;
};

// Get column color
export const getColumnColor = (columnId: string) => {
  switch(columnId) {
    case "design": return "bg-kanban-design text-white";
    case "analyse": return "bg-kanban-analyse text-white";
    case "dev": return "bg-kanban-dev text-white";
    case "testing": return "bg-kanban-testing text-white";
    default: return "bg-slate-400 text-white";
  }
};
