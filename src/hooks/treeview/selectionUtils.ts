
import { SelectionItem, SelectionState, SelectionBox } from './types';

// Calculate which items fall within the selection box
export function calculateSelectedItems(
  elementsRef: SelectionItem[],
  selectionBox: SelectionBox
): SelectionState {
  const selectionBoxRect = {
    left: selectionBox.left,
    right: selectionBox.left + selectionBox.width,
    top: selectionBox.top,
    bottom: selectionBox.top + selectionBox.height
  };
  
  const selectedTasksIds: string[] = [];
  const selectedFigures: {taskId: string, figureId: string}[] = [];
  
  elementsRef.forEach(item => {
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
  
  return {
    tasks: selectedTasksIds,
    figures: selectedFigures
  };
}

// Update selection box dimensions based on mouse coordinates
export function updateSelectionBox(
  selectionStart: { x: number, y: number },
  currentPosition: { x: number, y: number }
): SelectionBox {
  const left = Math.min(selectionStart.x, currentPosition.x);
  const top = Math.min(selectionStart.y, currentPosition.y);
  const width = Math.abs(currentPosition.x - selectionStart.x);
  const height = Math.abs(currentPosition.y - selectionStart.y);
  
  return { left, top, width, height };
}
