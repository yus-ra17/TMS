import api from './client';
import type { User } from '../types';

export const usersApi = {
  getAll: () => api.get<User[]>('/users').then((r) => r.data),
};
