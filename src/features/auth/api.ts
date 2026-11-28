import { http } from '@/shared/api/httpClient';
import type { AuthUser } from '@/shared/types/api.types';

export type LoginInput = { identifier: string; password: string };
type RegisterInput = {
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password: string;
};
const publicRequest = { auth: false };

export const authApi = {
  login: (input: LoginInput) =>
    http.post<{ token: string; user: AuthUser }>('/auth/login', input, publicRequest),
  register: (input: RegisterInput) =>
    http.post<Pick<RegisterInput, 'email' | 'username'>>('/auth/register', input, publicRequest),
  recover: (email: string) => http.post<null>('/auth/recover', { email }, publicRequest),
  me: (signal?: AbortSignal) => http.get<AuthUser>('/auth/me', undefined, { signal }),
};
