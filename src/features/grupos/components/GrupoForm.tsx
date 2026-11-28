import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { notifyError } from '@/shared/utils/notify';
import { grupoSchema } from '../schema';
import type { Grupo } from '../types';

export function GrupoForm({
  grupo,
  userId,
  onSave,
  onCancel,
}: {
  grupo?: Grupo;
  userId: number;
  onSave: (nombre: string, administradorId: number) => Promise<void>;
  onCancel: () => void;
}) {
  const form = useForm({
    initialValues: {
      nombre: grupo?.nombre ?? '',
      administrador: String(grupo?.administradorId ?? userId),
    },
    validate: zod4Resolver(grupoSchema),
  });
  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        try {
          await onSave(values.nombre.trim(), Number(values.administrador));
        } catch (error) {
          notifyError(error);
        }
      })}
    >
      <Stack>
        <TextInput required label="Nombre del grupo" {...form.getInputProps('nombre')} />
        {grupo && (
          <Select
            label="Administrador del grupo"
            allowDeselect={false}
            data={grupo.miembros.map((id) => ({ value: String(id), label: `Usuario #${id}` }))}
            {...form.getInputProps('administrador')}
          />
        )}
        <Group>
          <Button type="submit" loading={form.submitting}>
            Guardar
          </Button>
          <Button variant="default" disabled={form.submitting} onClick={onCancel}>
            Cancelar
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
