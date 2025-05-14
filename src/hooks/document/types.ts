
import { Document } from "@/types";

export interface CroppedFigure {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sourceDocumentId: string;
  label?: string;
}

export interface CropCoordinates {
  x: number;
  y: number;
}

export interface UseDocumentPreviewProps {
  document: Document | null;
  onSaveFigures?: (figures: CroppedFigure[]) => void;
}

export interface UseDocumentPreviewReturn {
  isImage: boolean;
  croppingMode: boolean;
  cropStart: CropCoordinates | null;
  cropEnd: CropCoordinates | null;
  croppedFigures: CroppedFigure[];
  activeFigureId: string | null;
  imgRef: React.RefObject<HTMLImageElement>;
  setCroppingMode: (mode: boolean) => void;
  setActiveFigureId: (id: string | null) => void;
  handleStartCrop: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleCropMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleEndCrop: () => void;
  handleCancelCrop: () => void;
  handleFigureChange: (id: string, field: 'title' | 'description' | 'label', value: string) => void;
  handleDeleteFigure: (id: string) => void;
  handleSave: () => void;
}
