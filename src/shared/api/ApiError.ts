export class ApiError extends Error {
  msg: string;
  code: number;
  status: number;

  constructor(msg: string, code: number, status: number) {
    super(msg);
    this.name = 'ApiError';
    this.msg = msg;
    this.code = code;
    this.status = status;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}
