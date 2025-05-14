
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, ImagePlus, Tag, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CroppedFigure {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sourceDocumentId: string;
  label?: string;
}

interface FiguresListProps {
  figures: CroppedFigure[];
  activeFigureId: string | null;
  onFigureChange: (id: string, field: 'title' | 'description' | 'label', value: string) => void;
  onDeleteFigure: (id: string) => void;
  onSelectFigure: (id: string) => void;
}

const FiguresList: React.FC<FiguresListProps> = ({
  figures,
  activeFigureId,
  onFigureChange,
  onDeleteFigure,
  onSelectFigure,
}) => {
  // Define available workflow labels
  const workflowLabels = [
    { id: "design", name: "Design", color: "bg-kanban-design" },
    { id: "analyse", name: "Analyse", color: "bg-kanban-analyse" },
    { id: "dev", name: "Development", color: "bg-kanban-dev" },
    { id: "testing", name: "Testing", color: "bg-kanban-testing" }
  ];

  if (figures.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-500">
        <ImagePlus className="h-10 w-10 mb-2 text-slate-400" />
        <p className="text-sm">
          Use the crop tool to extract figures from this document
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-4">
        {figures.map((figure) => (
          <div
            key={figure.id}
            className={`border p-3 rounded-md ${
              activeFigureId === figure.id
                ? "ring-2 ring-blue-500 border-blue-500"
                : ""
            }`}
            onClick={() => onSelectFigure(figure.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <Label htmlFor={`figure-title-${figure.id}`} className="text-xs text-slate-500">
                  Title
                </Label>
                <Input
                  id={`figure-title-${figure.id}`}
                  value={figure.title}
                  onChange={(e) => onFigureChange(figure.id, 'title', e.target.value)}
                  className="mt-1"
                  placeholder="Add a title for this figure"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteFigure(figure.id)}
                className="h-8 w-8 p-0 ml-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>

            <div className="mt-2">
              <Label htmlFor={`figure-desc-${figure.id}`} className="text-xs text-slate-500">
                Description
              </Label>
              <Textarea
                id={`figure-desc-${figure.id}`}
                value={figure.description}
                onChange={(e) => onFigureChange(figure.id, 'description', e.target.value)}
                className="mt-1 h-20"
                placeholder="Add a description for this figure"
              />
            </div>

            <div className="mt-2 h-20 bg-slate-100 rounded-md overflow-hidden">
              <img
                src={figure.imageUrl}
                alt={figure.title}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Label Selector Popover */}
            <div className="mt-3">
              <Label className="text-xs text-slate-500 mb-1 block">
                Workflow Stage
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-between text-left font-normal"
                  >
                    <div className="flex items-center">
                      {figure.label ? (
                        <>
                          <span 
                            className={`w-2 h-2 rounded-full mr-2 ${workflowLabels.find(l => l.id === figure.label)?.color || 'bg-slate-400'}`}
                          />
                          <span>
                            {workflowLabels.find(l => l.id === figure.label)?.name || 'Select stage'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Tag className="h-4 w-4 mr-2" />
                          <span>Select stage</span>
                        </>
                      )}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-56" align="start">
                  <div className="py-2">
                    {workflowLabels.map((label) => (
                      <div
                        key={label.id}
                        className="flex items-center px-3 py-2 hover:bg-slate-100 cursor-pointer"
                        onClick={() => {
                          onFigureChange(figure.id, 'label', label.id);
                          toast.success(`Figure assigned to ${label.name}`);
                        }}
                      >
                        <span className={`w-3 h-3 rounded-full ${label.color} mr-2`}></span>
                        <span className="flex-1">{label.name}</span>
                        {figure.label === label.id && <Check className="h-4 w-4 text-green-600" />}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default FiguresList;
