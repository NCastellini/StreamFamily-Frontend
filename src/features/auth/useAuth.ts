import { createContext, useContext } from 'react';
import type { AuthUser, UserRole } from '@/shared/types/api.types';
import type { LoginInput } from './api';

type AuthContextValue = {
  user: AuthUser | null;
  role: UserRole | null;
  token: string | null;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth requiere AuthProvider');
  return auth;
}
