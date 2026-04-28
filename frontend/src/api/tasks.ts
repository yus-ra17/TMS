import api from './client';
import { PaginatedTasks, Task, TaskStatus } from '../types';

export const tasksApi = {
  getAll: (projectId: string, params: { page?: number; limit?: number; status?: TaskStatus }) =>
    api.get<PaginatedTasks>(`/projects/${projectId}/tasks`, { params }).then((r) => r.data),

  create: (projectId: string, data: { title: string; description?: string; assigneeId?: string }) =>
    api.post<Task>(`/projects/${projectId}/tasks`, data).then((r) => r.data),

  updateStatus: (taskId: string, status: TaskStatus) =>
    api.patch<Task>(`/tasks/${taskId}/status`, { status }).then((r) => r.data),

  assign: (taskId: string, assigneeId: string) =>
    api.patch<Task>(`/tasks/${taskId}/assign`, { assigneeId }).then((r) => r.data),

  delete: (taskId: string) => api.delete(`/tasks/${taskId}`).then((r) => r.data),
};
