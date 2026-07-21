export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location?: string;
  status: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  order: number;
  columnId?: string;
  tags?: string[];
  description?: string;
}

export interface Column {
  id: string;
  name: string;
  order: number;
  jobApplications: JobApplication[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
}
