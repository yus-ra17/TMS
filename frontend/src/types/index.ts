export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ProjectMember {
  userId: string;
  user: User;
  role: 'OWNER' | 'MEMBER';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  members?: ProjectMember[];
  memberCount?: number;
  ownerId?: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  projectId: string;
  assignee?: User | null;
  assigneeId?: string | null;
  creator?: User;
  creatorId?: string;
  createdAt?: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
