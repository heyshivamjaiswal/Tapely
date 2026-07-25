
export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string | null;
  status: string;
  notes: string | null;
  salary: string | null;
  jobUrl: string | null;
  order: number;
  columnId: string;
  tags: string[] | null;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  name: string;
  order: number;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
  jobApplications: JobApplication[];
}

export interface Board {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  columns: Column[];
}