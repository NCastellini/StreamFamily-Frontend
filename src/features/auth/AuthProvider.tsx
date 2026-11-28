import { Alert, Button, Center, Loader } from '@mantine/core';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { configureAuth } from '@/shared/api/httpClient';
import type { AuthUser } from '@/shared/types/api.types';
import { authApi, type LoginInput } from './api';
import { AuthContext } from './useAuth';

const tokenKey = 'streamfamily.auth.token';
const readToken = () => localStorage.getItem(tokenKey);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(readToken);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const logout = useCallback(() => {
    localStorage.removeItem(tokenKey);
    setToken(null);
    setUser(null);
    setError('');
  }, []);

  useEffect(() => {
    configureAuth({ getToken: readToken, onUnauthorized: logout });
    function sync(event: StorageEvent) {
      if (event.storageArea === localStorage && (event.key === tokenKey || event.key === null)) {
        setUser(null);
        setToken(readToken());
        setError('');
        setAttempt((previous) => previous + 1);
      }
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [logout]);

  useEffect(() => {
    if (!token || user) return;
    const controller = new AbortController();
    authApi.me(controller.signal).then(
      ({ data }) => {
        if (!controller.signal.aborted && readToken() === token) setUser(data);
      },
      (cause: unknown) => {
        if (!controller.signal.aborted && readToken() === token)
          setError(cause instanceof Error ? cause.message : 'No se pudo validar la sesión');
      },
    );
    return () => controller.abort();
  }, [token, user, attempt]);

  useEffect(() => {
    if (!token || !user) return;
    // El backend emite JWT con exp en segundos. /me valida su autenticidad.
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload)) as { exp: number };
    const timeout = window.setTimeout(
      () => {
        if (readToken() === token) logout();
      },
      Math.max(0, exp * 1000 - Date.now()),
    );
    return () => window.clearTimeout(timeout);
  }, [token, user, logout]);

  async function login(input: LoginInput) {
    const { data } = await authApi.login(input);
    localStorage.setItem(tokenKey, data.token);
    setToken(data.token);
    setUser(data.user);
    setError('');
  }

  if (token && !user) {
    if (error)
      return (
        <Alert color="red" title="No se pudo validar la sesión">
          {error}
          <Button
            onClick={() => {
              setError('');
              setAttempt(attempt + 1);
            }}
          >
            Reintentar
          </Button>
          <Button variant="subtle" onClick={logout}>
            Cerrar sesión
          </Button>
        </Alert>
      );
    return (
      <Center mih="60vh">
        <Loader aria-label="Validando sesión" />
      </Center>
    );
  }

  return (
    <AuthContext.Provider value={{ user, role: user?.role ?? null, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
