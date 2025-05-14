
import { useState, useRef, useEffect } from "react";
import { SelectionState, SelectionItem, SelectionBox } from './types';
import { calculateSelectedItems, updateSelectionBox } from './selectionUtils';
import { toggleTaskInSelection, toggleFigureInSelection } from './selectionState';

export function useTreeViewSelection(onSelectItems: (items: SelectionState) => void) {
  // State for selection
  const [selectedItems, setSelectedItems] = useState<SelectionState>({
    tasks: [],
    figures: []
  });
  
  // State for tracking mouse selection
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionBox, setSelectionBox] = useState<SelectionBox>({ 
    left: 0, top: 0, width: 0, height: 0 
  });
  
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
    
    const newSelection = toggleTaskInSelection(selectedItems, taskId);
    setSelectedItems(newSelection);
    
    // Update parent component
    onSelectItems(newSelection);
  };
  
  const toggleFigureSelection = (taskId: string, figureId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const newSelection = toggleFigureInSelection(selectedItems, taskId, figureId);
    setSelectedItems(newSelection);
    
    // Update parent component
    onSelectItems(newSelection);
  };
  
  // Clear selection
  const clearSelection = () => {
    setSelectedItems({tasks: [], figures: []});
    onSelectItems({tasks: [], figures: []});
  };
  
  // Handle mouse selection
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't start selection if we clicked on an interactive element
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('a')) {
      return;
    }
    
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
    
    const newSelectionBox = updateSelectionBox(selectionStart, { x, y });
    setSelectionBox(newSelectionBox);
  };
  
  const handleMouseUp = () => {
    if (!isSelecting) return;
    
    // Calculate which items fall within the selection box
    const newSelection = calculateSelectedItems(elementsRef.current, selectionBox);
    
    setSelectedItems(newSelection);
    
    // Update parent component
    onSelectItems(newSelection);
    
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

  // Update element refs when dimensions change
  useEffect(() => {
    const updateElementRefs = () => {
      // Force update of element refs next frame
      setTimeout(() => {
        const updatedRefs: SelectionItem[] = [];
        elementsRef.current.forEach(item => {
          const element = document.querySelector(`[data-id="${item.id}"][data-type="${item.type}"]`);
          if (element) {
            const rect = element.getBoundingClientRect();
            updatedRefs.push({ ...item, rect });
          }
        });
        elementsRef.current = updatedRefs;
      }, 0);
    };
    
    window.addEventListener('resize', updateElementRefs);
    return () => window.removeEventListener('resize', updateElementRefs);
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
