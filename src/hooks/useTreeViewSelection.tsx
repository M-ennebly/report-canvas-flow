
import { useState, useRef, useEffect } from "react";

interface SelectionItem {
  id: string;
  type: 'task' | 'figure';
  taskId?: string;
  rect: DOMRect;
}

interface SelectionState {
  tasks: string[];
  figures: {taskId: string, figureId: string}[];
}

export function useTreeViewSelection(onSelectItems: (items: SelectionState) => void) {
  // State for selection
  const [selectedItems, setSelectedItems] = useState<SelectionState>({
    tasks: [],
    figures: []
  });
  
  // State for tracking mouse selection
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionBox, setSelectionBox] = useState({ left: 0, top: 0, width: 0, height: 0 });
  
  // Track element positions for selection
  const elementsRef = useRef<SelectionItem[]>([]);

  // Get width of tree view container for the toolbar
  const [treeViewWidth, setTreeViewWidth] = useState(0);
  const treeViewRef = useRef<HTMLDivElement>(null);

  // Check if any items are selected
  const hasSelectedItems = selectedItems.tasks.length > 0 || selectedItems.figures.length > 0;
  
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
  
  // Clear selection
  const clearSelection = () => {
    setSelectedItems({tasks: [], figures: []});
    onSelectItems({tasks: [], figures: []});
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

  return {
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
  };
}
