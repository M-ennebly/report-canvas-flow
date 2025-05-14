
import { SelectionState } from './types';

// Handle toggling task selection
export function toggleTaskInSelection(
  selectedItems: SelectionState, 
  taskId: string
): SelectionState {
  const isSelected = selectedItems.tasks.includes(taskId);
  
  if (isSelected) {
    return {
      ...selectedItems,
      tasks: selectedItems.tasks.filter(id => id !== taskId)
    };
  } else {
    return {
      ...selectedItems,
      tasks: [...selectedItems.tasks, taskId]
    };
  }
}

// Handle toggling figure selection
export function toggleFigureInSelection(
  selectedItems: SelectionState,
  taskId: string,
  figureId: string
): SelectionState {
  const isSelected = selectedItems.figures.some(
    f => f.figureId === figureId && f.taskId === taskId
  );
  
  if (isSelected) {
    return {
      ...selectedItems,
      figures: selectedItems.figures.filter(
        f => !(f.figureId === figureId && f.taskId === taskId)
      )
    };
  } else {
    return {
      ...selectedItems,
      figures: [...selectedItems.figures, { taskId, figureId }]
    };
  }
}
