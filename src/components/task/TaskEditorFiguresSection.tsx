
import React from "react";
import TaskEditorFigure from "./TaskEditorFigure";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useTaskEditorSidebar } from "./TaskEditorSidebarContext";

const TaskEditorFiguresSection: React.FC = () => {
  const { 
    editedTask, 
    collapsedFigures, 
    handleReorderFigures,
    toggleFigureCollapse,
    handleFigureTitleChange,
    handleFigureDescriptionChange,
    handleDeleteFigure
  } = useTaskEditorSidebar();

  if (!editedTask) return null;

  const figures = editedTask.figures;

  const handleDragEnd = (result: DropResult) => {
    // If dropped outside the list or no movement
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    // Reorder the figures
    const reorderedFigures = Array.from(figures);
    const [removed] = reorderedFigures.splice(result.source.index, 1);
    reorderedFigures.splice(result.destination.index, 0, removed);

    // Update the parent component with new order
    handleReorderFigures(reorderedFigures);
  };

  return (
    <div className="rounded-lg bg-gray-50 shadow-sm border overflow-hidden">
      <div className="flex items-center justify-between w-full px-4 py-3 bg-gray-100">
        <h3 className="text-md font-medium flex items-center">
          <span className="mr-2">Figures</span>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {figures.length}
          </span>
        </h3>
      </div>
      
      <div className="p-4 space-y-4">
        {figures.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No figures attached to this task
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="figures-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {figures.map((figure, index) => (
                    <Draggable key={figure.id} draggableId={figure.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${snapshot.isDragging ? "opacity-70" : ""}`}
                        >
                          <TaskEditorFigure
                            figure={figure}
                            index={index}
                            isCollapsed={!!collapsedFigures[figure.id]}
                            onToggleCollapse={() => toggleFigureCollapse(figure.id)}
                            onTitleChange={(value) => handleFigureTitleChange(figure.id, value)}
                            onDescriptionChange={(value) => handleFigureDescriptionChange(figure.id, value)}
                            onDelete={() => handleDeleteFigure(figure.id)}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default TaskEditorFiguresSection;
