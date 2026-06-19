import { useState } from 'react';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { getFirebaseAuthErrorMessage, type LoginCredentials } from '@/services/firebase-auth.service';
import { type UserRole } from '@/store/auth.store';

export function useLogin() {
  const auth = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function login(credentials: LoginCredentials, role?: UserRole) {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await auth.signIn(credentials, role);
    } catch (error) {
      const message = error instanceof Error ? error.message : getFirebaseAuthErrorMessage(error);
      setErrorMessage(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    errorMessage: errorMessage ?? auth.errorMessage,
    isFirebaseConfigured: auth.isFirebaseConfigured,
    isLoading: isLoading || auth.isLoading,
    login,
  };
}
