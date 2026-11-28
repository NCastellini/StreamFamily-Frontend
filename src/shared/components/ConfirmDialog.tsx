import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';
import { notifyError } from '@/shared/utils/notify';

export type ConfirmDialogProps = {
  opened: boolean;
  title?: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  color?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

/**
 * Modal de confirmación. No captures el error en onConfirm: dejalo propagar y
 * ConfirmDialog lo notifica (así no se duplica el aviso).
 */
export function ConfirmDialog({
  opened,
  title = 'Confirmar',
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  color = 'red',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [enCurso, setEnCurso] = useState(false);
  const ocupado = loading || enCurso;

  const confirmar = async () => {
    setEnCurso(true);
    try {
      await onConfirm();
    } catch (e) {
      notifyError(e);
    } finally {
      setEnCurso(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={ocupado ? () => {} : onCancel}
      title={title}
      centered
      closeOnClickOutside={!ocupado}
      closeOnEscape={!ocupado}
      withCloseButton={!ocupado}
    >
      {typeof message === 'string' ? <Text size="sm">{message}</Text> : message}
      <Group justify="flex-end" mt="lg">
        <Button variant="default" onClick={onCancel} disabled={ocupado}>
          {cancelLabel}
        </Button>
        <Button color={color} onClick={confirmar} loading={ocupado}>
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
}
