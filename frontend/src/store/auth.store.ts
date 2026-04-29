import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: typeof window !== 'undefined' ? localStorage.getItem('tms_token') : null,
      user: null,
      setAuth: (token, user) => {
        localStorage.setItem('tms_token', token);
        set({ token, user });
      },
      logout: () => {
        localStorage.removeItem('tms_token');
        set({ token: null, user: null });
      },
    }),
    { name: 'tms_auth' },
  ),
);
