
import React from "react";

interface SelectionBoxProps {
  isSelecting: boolean;
  selectionBox: { left: number; top: number; width: number; height: number };
}

const SelectionBox: React.FC<SelectionBoxProps> = ({ isSelecting, selectionBox }) => {
  if (!isSelecting) return null;
  
  return (
    <div
      className="absolute border-2 border-blue-400 bg-blue-100 bg-opacity-20 pointer-events-none"
      style={{
        left: selectionBox.left,
        top: selectionBox.top,
        width: selectionBox.width,
        height: selectionBox.height
      }}
    />
  );
};

export default SelectionBox;
