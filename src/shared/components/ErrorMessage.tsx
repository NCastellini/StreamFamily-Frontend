import { Alert, Button, Text } from '@mantine/core';
import { isApiError } from '@/shared/api/ApiError';

export type ErrorMessageProps = {
  error: unknown;
  onRetry?: () => void;
  title?: string;
};

const MSG_ERROR_GENERICO = 'Ocurrió un error inesperado';

export function ErrorMessage({ error, onRetry, title = 'Error' }: ErrorMessageProps) {
  const mensaje = isApiError(error) ? error.msg : MSG_ERROR_GENERICO;

  return (
    <Alert color="red" variant="light" title={title}>
      <Text size="sm">{mensaje}</Text>
      {onRetry && (
        <Button size="xs" variant="light" color="red" mt="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </Alert>
  );
}
