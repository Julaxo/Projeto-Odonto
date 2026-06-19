import { createContext, type PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import {
  getFirebaseAuthErrorMessage,
  loginWithFirebase,
  logoutFromFirebase,
  subscribeToFirebaseAuthState,
  type FirebaseAuthUser,
  type LoginCredentials,
} from '@/services/firebase-auth.service';
import { hasFirebaseConfig } from '@/services/firebase';
import { type UserRole, useAuthStore } from '@/store/auth.store';

type AuthContextValue = {
  errorMessage: string | null;
  isAuthenticated: boolean;
  isFirebaseConfigured: boolean;
  isLoading: boolean;
  role: UserRole;
  setRole: (role: UserRole) => void;
  signIn: (credentials: LoginCredentials, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  user: FirebaseAuthUser | null;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const role = useAuthStore((state) => state.role);
  const setRole = useAuthStore((state) => state.setRole);
  const storeSignIn = useAuthStore((state) => state.signIn);
  const storeSignOut = useAuthStore((state) => state.signOut);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(hasFirebaseConfig);
  const [user, setUser] = useState<FirebaseAuthUser | null>(null);

  useEffect(() => {
    if (!hasFirebaseConfig) {
      return;
    }

    const unsubscribe = subscribeToFirebaseAuthState((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);

      if (firebaseUser) {
        storeSignIn(firebaseUser);
        return;
      }

      storeSignOut();
    });

    return unsubscribe;
  }, [storeSignIn, storeSignOut]);

  const signIn = useCallback(async (credentials: LoginCredentials, selectedRole?: UserRole) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const firebaseUser = await loginWithFirebase(credentials);
      setUser(firebaseUser);
      storeSignIn(firebaseUser, selectedRole);
    } catch (error) {
      const message = getFirebaseAuthErrorMessage(error);
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [storeSignIn]);

  const signOut = useCallback(async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (hasFirebaseConfig) {
        await logoutFromFirebase();
      }

      setUser(null);
      storeSignOut();
    } finally {
      setIsLoading(false);
    }
  }, [storeSignOut]);

  const value = useMemo<AuthContextValue>(
    () => ({
      errorMessage,
      isAuthenticated: Boolean(user),
      isFirebaseConfigured: hasFirebaseConfig,
      isLoading,
      role,
      setRole,
      signIn,
      signOut,
      user,
    }),
    [errorMessage, isLoading, role, setRole, signIn, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
