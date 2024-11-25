import { create } from 'zustand';
import { User } from '../types';
import authService from '../services/auth.service';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: !!authService.getToken(),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  login: async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      set({ user: response.user, isAuthenticated: true });
      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
}));