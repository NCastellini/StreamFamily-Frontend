import { notifications } from '@mantine/notifications';
import { isApiError } from '@/shared/api/ApiError';

const MSG_ERROR_GENERICO = 'Ocurrió un error inesperado';

export function notifyError(error: unknown, fallback?: string): void {
  const message = isApiError(error) ? error.msg : (fallback ?? MSG_ERROR_GENERICO);
  notifications.show({ color: 'red', title: 'Error', message });
}

export function notifySuccess(message: string): void {
  notifications.show({ color: 'green', title: 'Listo', message });
}
