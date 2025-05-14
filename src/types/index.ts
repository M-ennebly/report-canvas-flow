
export interface Figure {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pageNumber?: number;
  documentId?: string;
}

export interface Task {
  id: string;
  title: string;
  figures: Figure[];
  column: "design" | "analyse" | "dev" | "testing";
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  dateUploaded: string;
  label?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  documents: Document[];
  tasks: Task[];
  linkedReportId?: string;
}

export interface CroppedFigure {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sourceDocumentId: string;
}
