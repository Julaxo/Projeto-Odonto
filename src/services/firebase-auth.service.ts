import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type Unsubscribe,
  type User,
} from '@firebase/auth';

import { getFirebaseAuth } from '@/services/firebase';

export type FirebaseAuthUser = {
  email: string;
  id: string;
  name: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export function mapFirebaseUser(user: User): FirebaseAuthUser {
  return {
    email: user.email ?? '',
    id: user.uid,
    name: user.displayName ?? user.email?.split('@')[0] ?? 'Paciente',
  };
}

export function getFirebaseAuthErrorMessage(error: unknown) {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return 'Nao foi possivel entrar. Tente novamente.';
  }

  const errorCode = typeof error.code === 'string' ? error.code : '';

  const messages: Record<string, string> = {
    'auth/invalid-credential': 'Email ou senha invalidos.',
    'auth/invalid-email': 'Informe um email valido.',
    'auth/network-request-failed': 'Falha de conexao. Verifique sua internet.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/user-not-found': 'Usuario nao encontrado.',
    'auth/wrong-password': 'Email ou senha invalidos.',
  };

  return messages[errorCode] ?? 'Nao foi possivel entrar. Tente novamente.';
}

export function subscribeToFirebaseAuthState(callback: (user: FirebaseAuthUser | null) => void): Unsubscribe {
  const auth = getFirebaseAuth();

  return onAuthStateChanged(auth, (user) => {
    callback(user ? mapFirebaseUser(user) : null);
  });
}

export async function loginWithFirebase({ email, password }: LoginCredentials) {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return mapFirebaseUser(credential.user);
}

export async function logoutFromFirebase() {
  const auth = getFirebaseAuth();

  await firebaseSignOut(auth);
}
