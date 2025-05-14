
// Types for tree view selection functionality
export interface SelectionItem {
  id: string;
  type: 'task' | 'figure';
  taskId?: string;
  rect: DOMRect;
}

export interface SelectionState {
  tasks: string[];
  figures: {taskId: string, figureId: string}[];
}

export interface SelectionBox {
  left: number;
  top: number;
  width: number;
  height: number;
}
