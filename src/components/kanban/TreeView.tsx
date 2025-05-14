
import React, { useState } from "react";
import { Task } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import TreeViewColumn from "./tree/TreeViewColumn";
import SelectionBox from "./tree/SelectionBox";
import TreeViewToolbar from "./tree/TreeViewToolbar";
import { useTreeViewSelection } from "@/hooks/useTreeViewSelection";
import { getColumnColor, getColumnDisplayName } from "./tree/TreeViewUtils";

interface TreeViewProps {
  tasks: Task[];
  columns: { id: string; title: string }[];
  onTaskClick: (taskId: string) => void;
  onSelectItems: (items: {tasks: string[], figures: {taskId: string, figureId: string}[]}) => void;
}

const TreeView: React.FC<TreeViewProps> = ({ 
  tasks, 
  columns, 
  onTaskClick, 
  onSelectItems 
}) => {
  // Track expanded columns and tasks
  const [expandedColumns, setExpandedColumns] = useState<Record<string, boolean>>({
    design: true,
    analyse: true,
    dev: true,
    testing: true,
  });
  
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  
  // Use our selection hook
  const {
    selectedItems,
    isSelecting,
    selectionBox,
    hasSelectedItems,
    treeViewWidth,
    treeViewRef,
    toggleTaskSelection,
    toggleFigureSelection,
    clearSelection,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    addElementRef
  } = useTreeViewSelection(onSelectItems);

  // Group tasks by column
  const tasksByColumn = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter(task => task.column === column.id);
    return acc;
  }, {} as Record<string, Task[]>);
  
  // Toggle column expansion
  const toggleColumn = (columnId: string) => {
    setExpandedColumns({
      ...expandedColumns,
      [columnId]: !expandedColumns[columnId]
    });
  };
  
  // Toggle task expansion
  const toggleTask = (taskId: string) => {
    setExpandedTasks({
      ...expandedTasks,
      [taskId]: !expandedTasks[taskId]
    });
  };
  
  return (
    <div 
      className="bg-white rounded-lg border shadow-sm h-[calc(100vh-220px)] relative select-none" 
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        if (isSelecting) handleMouseUp();
      }}
      ref={treeViewRef}
      style={{ userSelect: 'none' }}
    >
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-medium">File Browser View</h3>
      </div>
      
      <ScrollArea className="h-[calc(100%-56px)]">
        <div className="p-3">
          {Object.entries(tasksByColumn).map(([columnId, columnTasks]) => (
            <TreeViewColumn
              key={columnId}
              columnId={columnId}
              columnTitle={getColumnDisplayName(columnId, columns)}
              columnTasks={columnTasks}
              expandedColumns={expandedColumns}
              expandedTasks={expandedTasks}
              selectedItems={selectedItems}
              onTaskClick={onTaskClick}
              toggleColumn={toggleColumn}
              toggleTask={toggleTask}
              toggleTaskSelection={toggleTaskSelection}
              toggleFigureSelection={toggleFigureSelection}
              addElementRef={addElementRef}
              getColumnColor={getColumnColor}
              isSelecting={isSelecting}
            />
          ))}
        </div>
      </ScrollArea>
      
      {/* Selection box */}
      <SelectionBox isSelecting={isSelecting} selectionBox={selectionBox} />

      {/* Floating Action Toolbar */}
      <TreeViewToolbar
        hasSelectedItems={hasSelectedItems}
        selectedItems={selectedItems}
        columns={columns}
        treeViewWidth={treeViewWidth}
        onClearSelection={clearSelection}
      />
    </div>
  );
};

export default TreeView;
