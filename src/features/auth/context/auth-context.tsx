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
import { useAuthStore } from '@/store/auth.store';

type AuthContextValue = {
  errorMessage: string | null;
  isAuthenticated: boolean;
  isFirebaseConfigured: boolean;
  isLoading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  user: FirebaseAuthUser | null;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
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

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const firebaseUser = await loginWithFirebase(credentials);
      setUser(firebaseUser);
      storeSignIn(firebaseUser);
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
      signIn,
      signOut,
      user,
    }),
    [errorMessage, isLoading, signIn, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
