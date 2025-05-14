
import React from "react";
import { CroppedFigure } from "@/hooks/document/useDocumentPreview";
import FiguresList from "./FiguresList";

interface FiguresPanelProps {
  figures: CroppedFigure[];
  activeFigureId: string | null;
  onFigureChange: (id: string, field: 'title' | 'description' | 'label', value: string) => void;
  onDeleteFigure: (id: string) => void;
  onSelectFigure: (id: string) => void;
}

const FiguresPanel: React.FC<FiguresPanelProps> = ({
  figures,
  activeFigureId,
  onFigureChange,
  onDeleteFigure,
  onSelectFigure
}) => {
  return (
    <div className="border rounded-md p-4 flex flex-col h-[400px] md:h-auto overflow-hidden bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Extracted Figures</h3>
        {figures.length > 0 && (
          <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
            {figures.length} figure{figures.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <FiguresList 
          figures={figures}
          activeFigureId={activeFigureId}
          onFigureChange={onFigureChange}
          onDeleteFigure={onDeleteFigure}
          onSelectFigure={onSelectFigure}
        />
      </div>
    </div>
  );
};

export default FiguresPanel;
