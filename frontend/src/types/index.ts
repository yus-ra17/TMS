export interface AuthResponse {
  access_token: string;
  userId: string;
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  members: ProjectMember[];
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: 'OWNER' | 'MEMBER';
  user: User;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  assignee?: User;
  creator: User;
}

export interface PaginatedTasks {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
