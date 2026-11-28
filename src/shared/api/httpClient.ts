/**
 * Cliente HTTP de la app. Agrega el token y convierte los errores del back en `ApiError`.
 *
 * @example
 * const res = await http.get<Alerta[]>('/alertas', { page: 1, limit: 10 });
 * await http.post('/auth/login', { email, password }, { auth: false });
 */
import type { ApiResponse } from '@/shared/types/api.types';
import { ApiError } from './ApiError';

type AuthHandlers = {
  getToken: () => string | null;
  onUnauthorized: () => void;
};

export type RequestOptions = { auth?: boolean; signal?: AbortSignal };

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const NETWORK_ERROR_MSG = 'No se pudo conectar con el servidor';

let authHandlers: AuthHandlers = {
  getToken: () => null,
  onUnauthorized: () => {},
};

export function configureAuth(handlers: AuthHandlers): void {
  authHandlers = handlers;
}

function buildUrl(path: string, params?: object): string {
  const base = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');
  const url = `${base}/${path.replace(/^\/+/, '')}`;
  if (!params) return url;

  const search = new URLSearchParams();
  const isEmpty = (v: unknown) => v === undefined || v === null || v === '';
  for (const [key, value] of Object.entries(params)) {
    const values: unknown[] = Array.isArray(value) ? value : [value];
    for (const v of values) {
      if (!isEmpty(v)) search.append(key, String(v));
    }
  }

  const query = search.toString();
  return query ? `${url}?${query}` : url;
}

function isAbortError(e: unknown): boolean {
  return typeof e === 'object' && e !== null && (e as { name?: unknown }).name === 'AbortError';
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function toApiError(body: unknown, status: number): ApiError {
  const b = body as Partial<ApiResponse> | undefined;
  if (b && typeof b === 'object' && typeof b.msg === 'string' && b.msg) {
    return new ApiError(b.msg, typeof b.code === 'number' ? b.code : status, status);
  }
  return new ApiError(`Ocurrió un error inesperado (${status})`, status, status);
}

async function request<T>(
  method: Method,
  path: string,
  { body, params, options = {} }: { body?: unknown; params?: object; options?: RequestOptions },
): Promise<ApiResponse<T>> {
  const useAuth = options.auth !== false;
  const headers: Record<string, string> = { Accept: 'application/json' };
  const hasBody = body !== undefined;
  if (hasBody) headers['Content-Type'] = 'application/json';

  if (useAuth) {
    const token = authHandlers.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: hasBody ? JSON.stringify(body) : undefined,
      signal: options.signal,
    });
  } catch (e) {
    if (isAbortError(e)) throw e;
    throw new ApiError(NETWORK_ERROR_MSG, 0, 0);
  }

  const text = res.status === 204 ? '' : await res.text();

  if (res.ok) {
    if (!text) return { msg: '', code: res.status, data: null } as ApiResponse<T>;
    const json = parseJson(text);
    if (json === undefined) throw toApiError(undefined, res.status);
    return json as ApiResponse<T>;
  }

  const error = toApiError(text ? parseJson(text) : undefined, res.status);
  if (res.status === 401 && useAuth) authHandlers.onUnauthorized();
  throw error;
}

export const http = {
  get<T>(path: string, params?: object, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>('GET', path, { params, options });
  },
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>('POST', path, { body, options });
  },
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>('PUT', path, { body, options });
  },
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>('PATCH', path, { body, options });
  },
  delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>('DELETE', path, { options });
  },
};
