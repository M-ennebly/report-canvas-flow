
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Document } from "@/types";
import { Crop, X, Check, ImagePlus, Tag } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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

interface DocumentPreviewModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveFigures?: (figures: CroppedFigure[]) => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  isOpen,
  onClose,
  onSaveFigures,
}) => {
  const [croppingMode, setCroppingMode] = useState(false);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null);
  const [croppedFigures, setCroppedFigures] = useState<CroppedFigure[]>([]);
  const [activeFigureId, setActiveFigureId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Define available workflow labels
  const workflowLabels = [
    { id: "design", name: "Design", color: "bg-kanban-design" },
    { id: "analyse", name: "Analyse", color: "bg-kanban-analyse" },
    { id: "dev", name: "Development", color: "bg-kanban-dev" },
    { id: "testing", name: "Testing", color: "bg-kanban-testing" }
  ];

  const isImage = document?.type.toLowerCase() === "image" || 
    ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(document?.type.toLowerCase() || "");

  const handleStartCrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!croppingMode || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCropStart({ x, y });
    setCropEnd({ x, y });
  };

  const handleCropMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!croppingMode || !cropStart || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
    
    setCropEnd({ x, y });
  };

  const handleEndCrop = () => {
    if (!croppingMode || !cropStart || !cropEnd || !document) return;
    
    // For a real implementation, we'd use canvas to crop the image
    // For this demo, we'll simulate it by capturing the coordinates
    const id = `figure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newFigure: CroppedFigure = {
      id,
      title: `Figure from ${document.name}`,
      description: "",
      imageUrl: document.url, // In a real app, this would be the cropped image URL
      sourceDocumentId: document.id,
      label: document.label // Inherit label from source document if available
    };

    setCroppedFigures([...croppedFigures, newFigure]);
    setActiveFigureId(id);
    
    // Reset crop state
    setCropStart(null);
    setCropEnd(null);
    setCroppingMode(false);
    
    toast.success("Area selected! Add details to your figure.");
  };

  const handleCancelCrop = () => {
    setCropStart(null);
    setCropEnd(null);
    setCroppingMode(false);
  };

  const handleFigureChange = (id: string, field: 'title' | 'description' | 'label', value: string) => {
    setCroppedFigures(
      croppedFigures.map((figure) =>
        figure.id === id ? { ...figure, [field]: value } : figure
      )
    );
  };

  const handleDeleteFigure = (id: string) => {
    setCroppedFigures(croppedFigures.filter((figure) => figure.id !== id));
    if (activeFigureId === id) {
      setActiveFigureId(null);
    }
  };

  const handleSave = () => {
    // Validate figures have titles
    const incompleteIndex = croppedFigures.findIndex(fig => !fig.title.trim());
    if (incompleteIndex >= 0) {
      toast.error("Please add a title to all figures");
      setActiveFigureId(croppedFigures[incompleteIndex].id);
      return;
    }

    if (onSaveFigures) {
      onSaveFigures(croppedFigures);
    }
    toast.success(`${croppedFigures.length} figures saved successfully`);
    onClose();
  };

  // Render file preview based on type
  const renderPreview = () => {
    if (!document) return null;
    
    if (isImage) {
      return (
        <div 
          ref={previewRef}
          className="relative w-full overflow-hidden bg-slate-100"
          style={{ cursor: croppingMode ? 'crosshair' : 'default' }}
          onMouseDown={handleStartCrop}
          onMouseMove={handleCropMove}
          onMouseUp={handleEndCrop}
          onMouseLeave={cropStart ? handleEndCrop : undefined}
        >
          <AspectRatio ratio={16/9} className="bg-slate-100">
            <img
              src={document.url}
              alt={document.name}
              className="h-full w-full object-contain"
            />
          </AspectRatio>
          
          {cropStart && cropEnd && (
            <div
              className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
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
    } else if (document.type === "pdf") {
      return (
        <div className="w-full text-center p-10 bg-slate-100 flex flex-col items-center justify-center rounded-md">
          <div className="text-3xl font-bold text-red-500 mb-2">PDF</div>
          <p className="text-slate-600">{document.name}</p>
          <p className="mt-4 text-sm text-slate-500">Preview not available for PDF files.</p>
        </div>
      );
    } else if (["doc", "docx", "word"].includes(document.type.toLowerCase())) {
      return (
        <div className="w-full text-center p-10 bg-slate-100 flex flex-col items-center justify-center rounded-md">
          <div className="text-3xl font-bold text-blue-500 mb-2">DOCX</div>
          <p className="text-slate-600">{document.name}</p>
          <p className="mt-4 text-sm text-slate-500">Preview not available for Word documents.</p>
        </div>
      );
    } else if (["ppt", "pptx", "powerpoint"].includes(document.type.toLowerCase())) {
      return (
        <div className="w-full text-center p-10 bg-slate-100 flex flex-col items-center justify-center rounded-md">
          <div className="text-3xl font-bold text-orange-500 mb-2">PPT</div>
          <p className="text-slate-600">{document.name}</p>
          <p className="mt-4 text-sm text-slate-500">Preview not available for PowerPoint files.</p>
        </div>
      );
    } else {
      return (
        <div className="w-full text-center p-10 bg-slate-100 flex flex-col items-center justify-center rounded-md">
          <div className="text-xl font-medium text-slate-600 mb-2">{document.type.toUpperCase()}</div>
          <p className="text-slate-600">{document.name}</p>
          <p className="mt-4 text-sm text-slate-500">Preview not available for this file type.</p>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[90%] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {document?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden flex-1">
          {/* Preview Panel - takes 2/3 width on desktop */}
          <div className="md:col-span-2 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-slate-500">
                {document?.type.toUpperCase()}
              </div>
              
              {isImage && (
                <div className="flex gap-2">
                  {!croppingMode ? (
                    <Button 
                      onClick={() => setCroppingMode(true)} 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Crop className="h-4 w-4" />
                      Crop Figure
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleCancelCrop} 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        disabled={!cropStart || !cropEnd}
                        className="flex items-center gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Select Area
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex-1 overflow-auto border rounded-md">
              {renderPreview()}
            </div>
          </div>
          
          {/* Figures Panel - takes 1/3 width on desktop */}
          <div className="border rounded-md p-4 flex flex-col h-[400px] md:h-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Extracted Figures</h3>
              {croppedFigures.length > 0 && (
                <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                  {croppedFigures.length} figure{croppedFigures.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {croppedFigures.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-500">
                <ImagePlus className="h-10 w-10 mb-2 text-slate-400" />
                <p className="text-sm">
                  {isImage 
                    ? "Use the crop tool to extract figures from this document" 
                    : "No figures have been extracted from this document yet"}
                </p>
              </div>
            ) : (
              <ScrollArea className="flex-1">
                <div className="space-y-4">
                  {croppedFigures.map((figure) => (
                    <div
                      key={figure.id}
                      className={`border p-3 rounded-md ${
                        activeFigureId === figure.id
                          ? "ring-2 ring-blue-500 border-blue-500"
                          : ""
                      }`}
                      onClick={() => setActiveFigureId(figure.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <Label htmlFor={`figure-title-${figure.id}`} className="text-xs text-slate-500">
                            Title
                          </Label>
                          <Input
                            id={`figure-title-${figure.id}`}
                            value={figure.title}
                            onChange={(e) => handleFigureChange(figure.id, 'title', e.target.value)}
                            className="mt-1"
                            placeholder="Add a title for this figure"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFigure(figure.id)}
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
                          onChange={(e) => handleFigureChange(figure.id, 'description', e.target.value)}
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
                                    handleFigureChange(figure.id, 'label', label.id);
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
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={croppedFigures.length === 0}>
            Save Figures ({croppedFigures.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewModal;
