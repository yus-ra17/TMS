import api from './client';
import { User } from '../types';

export const usersApi = {
  getAll: () => api.get<User[]>('/users').then((r) => r.data),
};
