
import React, { useState, useEffect } from "react";
import { Task } from "@/types";
import { ChevronRight, FolderIcon, File, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  // State for selection
  const [selectedItems, setSelectedItems] = useState<{
    tasks: string[],
    figures: {taskId: string, figureId: string}[]
  }>({
    tasks: [],
    figures: []
  });
  
  // State for tracking mouse selection
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionBox, setSelectionBox] = useState({ left: 0, top: 0, width: 0, height: 0 });
  
  // Track element positions for selection
  const elementsRef = React.useRef<{
    id: string;
    type: 'task' | 'figure';
    taskId?: string;
    rect: DOMRect;
  }[]>([]);

  // Track tree view container reference
  const treeViewRef = React.useRef<HTMLDivElement>(null);

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
  
  // Handle column name display
  const getColumnDisplayName = (columnId: string) => {
    const column = columns.find(c => c.id === columnId);
    return column ? column.title : columnId;
  };
  
  // Handle item selection
  const toggleTaskSelection = (taskId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setSelectedItems(prev => {
      const isSelected = prev.tasks.includes(taskId);
      
      if (isSelected) {
        return {
          ...prev,
          tasks: prev.tasks.filter(id => id !== taskId)
        };
      } else {
        return {
          ...prev,
          tasks: [...prev.tasks, taskId]
        };
      }
    });
    
    // Update parent component
    onSelectItems({
      ...selectedItems,
      tasks: selectedItems.tasks.includes(taskId) 
        ? selectedItems.tasks.filter(id => id !== taskId)
        : [...selectedItems.tasks, taskId]
    });
  };
  
  const toggleFigureSelection = (taskId: string, figureId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setSelectedItems(prev => {
      const isSelected = prev.figures.some(f => f.figureId === figureId && f.taskId === taskId);
      
      if (isSelected) {
        return {
          ...prev,
          figures: prev.figures.filter(f => !(f.figureId === figureId && f.taskId === taskId))
        };
      } else {
        return {
          ...prev,
          figures: [...prev.figures, { taskId, figureId }]
        };
      }
    });
    
    // Update parent component
    onSelectItems({
      ...selectedItems,
      figures: selectedItems.figures.some(f => f.figureId === figureId && f.taskId === taskId)
        ? selectedItems.figures.filter(f => !(f.figureId === figureId && f.taskId === taskId))
        : [...selectedItems.figures, { taskId, figureId }]
    });
  };
  
  // Handle mouse selection
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsSelecting(true);
    const container = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;
    
    setSelectionStart({ x, y });
    setSelectionBox({ left: x, top: y, width: 0, height: 0 });
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting) return;
    
    const container = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;
    
    const left = Math.min(selectionStart.x, x);
    const top = Math.min(selectionStart.y, y);
    const width = Math.abs(x - selectionStart.x);
    const height = Math.abs(y - selectionStart.y);
    
    setSelectionBox({ left, top, width, height });
  };
  
  const handleMouseUp = () => {
    if (!isSelecting) return;
    
    // Calculate which items fall within the selection box
    const selectionBoxRect = {
      left: selectionBox.left,
      right: selectionBox.left + selectionBox.width,
      top: selectionBox.top,
      bottom: selectionBox.top + selectionBox.height
    };
    
    const selectedTasksIds: string[] = [];
    const selectedFigures: {taskId: string, figureId: string}[] = [];
    
    elementsRef.current.forEach(item => {
      const itemRect = item.rect;
      const isIntersecting = !(
        selectionBoxRect.right < itemRect.left ||
        selectionBoxRect.left > itemRect.right ||
        selectionBoxRect.bottom < itemRect.top ||
        selectionBoxRect.top > itemRect.bottom
      );
      
      if (isIntersecting) {
        if (item.type === 'task') {
          selectedTasksIds.push(item.id);
        } else if (item.type === 'figure') {
          selectedFigures.push({taskId: item.taskId!, figureId: item.id});
        }
      }
    });
    
    setSelectedItems({
      tasks: selectedTasksIds,
      figures: selectedFigures
    });
    
    // Update parent component
    onSelectItems({
      tasks: selectedTasksIds,
      figures: selectedFigures
    });
    
    setIsSelecting(false);
    setSelectionBox({ left: 0, top: 0, width: 0, height: 0 });
  };
  
  // Add ref to track element position
  const addElementRef = (id: string, type: 'task' | 'figure', element: HTMLDivElement | null, taskId?: string) => {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    
    // Remove previous ref for this id if it exists
    elementsRef.current = elementsRef.current.filter(item => !(item.id === id && item.type === type));
    
    // Add new ref
    elementsRef.current.push({ id, type, taskId, rect });
  };
  
  // Get column color
  const getColumnColor = (columnId: string) => {
    switch(columnId) {
      case "design": return "bg-kanban-design text-white";
      case "analyse": return "bg-kanban-analyse text-white";
      case "dev": return "bg-kanban-dev text-white";
      case "testing": return "bg-kanban-testing text-white";
      default: return "bg-slate-400 text-white";
    }
  };

  // Get width of tree view container for the toolbar
  const [treeViewWidth, setTreeViewWidth] = useState(0);

  // Update width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (treeViewRef.current) {
        setTreeViewWidth(treeViewRef.current.offsetWidth);
      }
    };

    updateWidth();
    
    // Add resize observer
    const resizeObserver = new ResizeObserver(updateWidth);
    if (treeViewRef.current) {
      resizeObserver.observe(treeViewRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  
  // Check if any items are selected
  const hasSelectedItems = selectedItems.tasks.length > 0 || selectedItems.figures.length > 0;

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
    >
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-medium">File Browser View</h3>
      </div>
      
      <ScrollArea className="h-[calc(100%-56px)]">
        <div className="p-3">
          {Object.entries(tasksByColumn).map(([columnId, columnTasks]) => (
            <div key={columnId} className="mb-4">
              <div 
                className="flex items-center cursor-pointer py-1 px-1 hover:bg-slate-50 rounded"
                onClick={() => toggleColumn(columnId)}
                ref={(el) => addElementRef(columnId, 'task', el)}
              >
                <ChevronRight
                  className={cn(
                    "h-4 w-4 mr-1 transition-transform",
                    expandedColumns[columnId] ? "rotate-90" : ""
                  )}
                />
                <div className={`w-3 h-3 rounded-full mr-2 ${getColumnColor(columnId).split(' ')[0]}`}></div>
                <span className="font-medium">{getColumnDisplayName(columnId)}</span>
                <span className="ml-2 text-xs text-slate-500">
                  ({columnTasks.length})
                </span>
              </div>
              
              {expandedColumns[columnId] && (
                <div className="ml-6 border-l pl-3 space-y-1 mt-1">
                  {columnTasks.map(task => (
                    <div key={task.id} className="mb-1">
                      <div 
                        ref={(el) => addElementRef(task.id, 'task', el)}
                        className={cn(
                          "flex items-center cursor-pointer py-1 px-1 hover:bg-slate-50 rounded",
                          selectedItems.tasks.includes(task.id) ? "bg-blue-100" : ""
                        )}
                        onClick={(e) => toggleTaskSelection(task.id, e)}
                        onDoubleClick={() => onTaskClick(task.id)}
                      >
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 mr-1 transition-transform",
                            expandedTasks[task.id] ? "rotate-90" : ""
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTask(task.id);
                          }}
                        />
                        <FolderIcon className="h-4 w-4 mr-1 text-amber-500" />
                        <span className="text-sm truncate">{task.title}</span>
                        <span className="ml-2 text-xs text-slate-500">
                          ({task.figures.length})
                        </span>
                      </div>
                      
                      {expandedTasks[task.id] && (
                        <div className="ml-6 border-l pl-3 space-y-1 mt-1">
                          {task.figures.map(figure => (
                            <div 
                              key={figure.id}
                              ref={(el) => addElementRef(figure.id, 'figure', el, task.id)}
                              className={cn(
                                "flex items-center cursor-pointer py-1 px-1 hover:bg-slate-50 rounded",
                                selectedItems.figures.some(f => f.figureId === figure.id) ? "bg-blue-100" : ""
                              )}
                              onClick={(e) => toggleFigureSelection(task.id, figure.id, e)}
                            >
                              <File className="h-4 w-4 mr-1 text-blue-500" />
                              <span className="text-sm truncate">{figure.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Selection box */}
      {isSelecting && (
        <div
          className="absolute border-2 border-blue-400 bg-blue-100 bg-opacity-20 pointer-events-none"
          style={{
            left: selectionBox.left,
            top: selectionBox.top,
            width: selectionBox.width,
            height: selectionBox.height
          }}
        />
      )}

      {/* Floating Action Toolbar */}
      {hasSelectedItems && (
        <div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white border shadow-lg p-3 rounded-lg z-50"
          style={{ 
            maxWidth: treeViewWidth - 30, 
            width: 'auto' 
          }}
        >
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-xs font-medium mr-1 whitespace-nowrap">
              {selectedItems.tasks.length > 0 ? 
                `${selectedItems.tasks.length} task(s) selected` : 
                `${selectedItems.figures.length} figure(s) selected`
              }
            </span>
            
            {selectedItems.tasks.length > 0 && (
              <>
                {columns.map((column) => (
                  <Button 
                    key={column.id}
                    variant="outline" 
                    size="sm"
                    className="text-xs px-2 py-1 h-auto"
                  >
                    Move to {column.title}
                  </Button>
                ))}
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="text-xs px-2 py-1 h-auto"
                >
                  Delete
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs px-2 py-1 h-auto"
              onClick={() => {
                setSelectedItems({tasks: [], figures: []});
                onSelectItems({tasks: [], figures: []});
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeView;
