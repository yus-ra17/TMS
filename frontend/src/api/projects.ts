import api from './client';
import type { Project } from '../types';

export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects').then((r) => r.data),

  getOne: (id: string) => api.get<Project>(`/projects/${id}`).then((r) => r.data),

  create: (data: { name: string; description?: string }) =>
    api.post<Project>('/projects', data).then((r) => r.data),

  addMember: (projectId: string, userId: string) =>
    api.post(`/projects/${projectId}/members`, { userId }).then((r) => r.data),

  removeMember: (projectId: string, userId: string) =>
    api.delete(`/projects/${projectId}/members/${userId}`).then((r) => r.data),
};
