import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { notifyError } from '@/shared/utils/notify';
import { medioPagoSchema } from '../schema';
import { TIPOS_MEDIO_PAGO } from '../types';
import type { MedioPago, MedioPagoInput, TipoMedioPago } from '../types';

type MedioPagoFormProps = {
  medio?: MedioPago;
  onSave: (input: MedioPagoInput) => Promise<void>;
  onCancel: () => void;
};

/** Solo nombre y tipo: nunca se cargan números de tarjeta. */
export function MedioPagoForm({ medio, onSave, onCancel }: MedioPagoFormProps) {
  const form = useForm<{ nombre: string; tipo: string | null }>({
    initialValues: { nombre: medio?.nombre ?? '', tipo: medio?.tipo ?? null },
    validate: zod4Resolver(medioPagoSchema),
  });

  return (
    <form
      onSubmit={form.onSubmit(async (v) => {
        try {
          await onSave({ nombre: v.nombre.trim(), tipo: v.tipo as TipoMedioPago });
        } catch (error) {
          notifyError(error);
        }
      })}
    >
      <Stack>
        <TextInput
          required
          label="Nombre"
          placeholder="Ej.: Visa Banco Nación"
          {...form.getInputProps('nombre')}
        />
        <Select required label="Tipo" data={TIPOS_MEDIO_PAGO} {...form.getInputProps('tipo')} />
        <Group justify="flex-end">
          <Button variant="default" disabled={form.submitting} onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" loading={form.submitting}>
            Guardar
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
