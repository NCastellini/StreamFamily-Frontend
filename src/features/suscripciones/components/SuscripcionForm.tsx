import { Button, Group, NumberInput, Select, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { notifyError } from '@/shared/utils/notify';
import { suscripcionSchema } from '../schema';
import { FRECUENCIAS, MONEDAS } from '../types';
import type { Frecuencia, Moneda, Suscripcion, SuscripcionInput } from '../types';
import { useOpciones } from '../useOpciones';

type Valores = {
  plataforma: string;
  plan: string;
  costo: number | string;
  moneda: string | null;
  frecuencia: string | null;
  fechaCobro: string | null;
  medioPagoId: string | null;
  categoriaId: string | null;
  grupoId: string | null;
};

type SuscripcionFormProps = {
  suscripcion?: Suscripcion;
  usuarioId: number;
  onSave: (input: SuscripcionInput) => Promise<void>;
  onCancel: () => void;
};

export function SuscripcionForm({
  suscripcion,
  usuarioId,
  onSave,
  onCancel,
}: SuscripcionFormProps) {
  const { categorias, mediosPago, grupos, cargando } = useOpciones();

  const form = useForm<Valores>({
    initialValues: {
      plataforma: suscripcion?.plataforma ?? '',
      plan: suscripcion?.plan ?? '',
      costo: suscripcion?.costo ?? '',
      moneda: suscripcion?.moneda ?? 'ARS',
      frecuencia: suscripcion?.frecuencia ?? 'mensual',
      fechaCobro: suscripcion?.fechaCobro ?? null,
      medioPagoId: suscripcion ? String(suscripcion.medioPagoId) : null,
      categoriaId: suscripcion ? String(suscripcion.categoriaId) : null,
      grupoId: suscripcion?.grupoId ? String(suscripcion.grupoId) : null,
    },
    validate: zod4Resolver(suscripcionSchema),
  });

  return (
    <form
      onSubmit={form.onSubmit(async (v) => {
        try {
          await onSave({
            plataforma: v.plataforma.trim(),
            plan: v.plan.trim(),
            costo: Number(v.costo),
            moneda: v.moneda as Moneda,
            frecuencia: v.frecuencia as Frecuencia,
            fechaCobro: v.fechaCobro as string,
            medioPagoId: Number(v.medioPagoId),
            categoriaId: Number(v.categoriaId),
            grupoId: v.grupoId ? Number(v.grupoId) : null,
            usuarioId: suscripcion?.usuarioId ?? usuarioId,
          });
        } catch (error) {
          notifyError(error);
        }
      })}
    >
      <Stack>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput required label="Plataforma" {...form.getInputProps('plataforma')} />
          <TextInput required label="Plan" {...form.getInputProps('plan')} />
          <NumberInput
            required
            label="Costo"
            min={0}
            decimalScale={2}
            decimalSeparator=","
            thousandSeparator="."
            {...form.getInputProps('costo')}
          />
          <Select
            required
            label="Moneda"
            allowDeselect={false}
            data={MONEDAS}
            {...form.getInputProps('moneda')}
          />
          <Select
            required
            label="Frecuencia"
            allowDeselect={false}
            data={FRECUENCIAS}
            {...form.getInputProps('frecuencia')}
          />
          <DateInput
            required
            label="Fecha de cobro"
            valueFormat="DD/MM/YYYY"
            placeholder="Elegí una fecha"
            {...form.getInputProps('fechaCobro')}
          />
          <Select
            required
            label="Medio de pago"
            searchable
            disabled={cargando}
            data={mediosPago.map((m) => ({ value: String(m.id), label: m.nombre }))}
            {...form.getInputProps('medioPagoId')}
          />
          <Select
            required
            label="Categoría"
            searchable
            disabled={cargando}
            data={categorias.map((c) => ({ value: String(c.id), label: c.nombre }))}
            {...form.getInputProps('categoriaId')}
          />
          <Select
            label="Grupo familiar"
            placeholder="Individual"
            clearable
            disabled={cargando}
            data={grupos.map((g) => ({ value: String(g.id), label: g.nombre }))}
            {...form.getInputProps('grupoId')}
          />
        </SimpleGrid>
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
