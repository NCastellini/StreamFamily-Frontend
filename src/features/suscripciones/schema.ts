import { z } from 'zod';

/** Mismas reglas que valida el back en /suscripciones. */
export const suscripcionSchema = z.object({
  plataforma: z.string().trim().min(1, 'Ingresá la plataforma').max(100, 'Máximo 100 caracteres'),
  plan: z.string().trim().min(1, 'Ingresá el plan').max(100, 'Máximo 100 caracteres'),
  costo: z.number({ error: 'Ingresá el costo' }).positive('El costo debe ser mayor a 0'),
  moneda: z.enum(['ARS', 'USD'], { error: 'Elegí la moneda' }),
  frecuencia: z.enum(['mensual', 'trimestral', 'anual'], { error: 'Elegí la frecuencia' }),
  fechaCobro: z
    .string({ error: 'Elegí la fecha de cobro' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Elegí la fecha de cobro'),
  medioPagoId: z.string({ error: 'Elegí un medio de pago' }).min(1, 'Elegí un medio de pago'),
  categoriaId: z.string({ error: 'Elegí una categoría' }).min(1, 'Elegí una categoría'),
  grupoId: z.string().nullable(),
});

export const medioPagoSchema = z.object({
  nombre: z.string().trim().min(1, 'Ingresá un nombre').max(100, 'Máximo 100 caracteres'),
  tipo: z.enum(['tarjeta_credito', 'tarjeta_debito', 'billetera', 'transferencia'], {
    error: 'Elegí el tipo',
  }),
});
