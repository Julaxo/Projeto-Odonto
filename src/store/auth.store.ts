import { create } from 'zustand';

export type AuthUser = {
  email: string;
  id: string;
  name: string;
};

type AuthState = {
  signIn: (user: AuthUser) => void;
  signOut: () => void;
  user: AuthUser | null;
};

export const useAuthStore = create<AuthState>((set) => ({
  signIn: (user) => set({ user }),
  signOut: () => set({ user: null }),
  user: null,
}));
