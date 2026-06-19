import { create } from 'zustand';

export type UserRole = 'dentist' | 'patient';

export type AuthUser = {
  email: string;
  id: string;
  name: string;
};

type AuthState = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  signIn: (user: AuthUser, role?: UserRole) => void;
  signOut: () => void;
  user: AuthUser | null;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: 'patient',
  setRole: (role) => set({ role }),
  signIn: (user, role) => set((state) => ({ role: role ?? state.role, user })),
  signOut: () => set({ role: 'patient', user: null }),
  user: null,
}));
