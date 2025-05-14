
import React from "react";

interface CropOverlayProps {
  croppingMode: boolean;
  cropStart: { x: number; y: number } | null;
  cropEnd: { x: number; y: number } | null;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  onMouseLeave?: () => void;
}

const CropOverlay: React.FC<CropOverlayProps> = ({
  croppingMode,
  cropStart,
  cropEnd,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
}) => {
  return (
    <div 
      className="absolute top-0 left-0 w-full h-full"
      style={{ cursor: croppingMode ? 'crosshair' : 'default' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {cropStart && cropEnd && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none z-10"
          style={{
            left: Math.min(cropStart.x, cropEnd.x),
            top: Math.min(cropStart.y, cropEnd.y),
            width: Math.abs(cropEnd.x - cropStart.x),
            height: Math.abs(cropEnd.y - cropStart.y)
          }}
        />
      )}
    </div>
  );
};

export default CropOverlay;
