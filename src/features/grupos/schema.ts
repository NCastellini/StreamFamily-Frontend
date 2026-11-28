import { z } from 'zod';
export const grupoSchema = z.object({
  nombre: z.string().trim().min(1, 'Ingresá un nombre para el grupo'),
});
export const usuarioIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, 'Ingresá un ID de usuario válido')
  .transform(Number)
  .pipe(z.number().int().positive('El ID debe ser positivo'));
