
import { Document, Project, Task, Figure } from "@/types";

export interface ProjectStateProps {
  labelId?: string;
  initialDocuments: Document[];
  selectedLabels: string[];
}

export interface ProjectStateActions {
  handleTaskMove: (taskId: string, sourceColumn: string, targetColumn: string) => void;
  handleSaveTask: (updatedTask: Task) => void;
  handleDeleteTask: (taskId: string) => void;
  handleDeleteFigure: (taskId: string, figureId: string) => void;
  handleDescriptionChange: (description: string) => void;
  handleLinkedReportChange: (reportId: string) => void;
  handleDocumentUpload: (files: FileList | Document[]) => void;
  handleDocumentDelete: (documentId: string) => void;
  handleExtractFigures: (documentId: string) => void;
}

export interface UseProjectStateReturn extends ProjectStateActions {
  project: Project;
}
