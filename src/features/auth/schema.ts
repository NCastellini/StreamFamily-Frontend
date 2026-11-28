import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Ingresá un email válido');

export const registerSchema = z.object({
  nombre: z.string().trim().min(1, 'Ingresá tu nombre'),
  apellido: z.string().trim().min(1, 'Ingresá tu apellido'),
  email: emailSchema,
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9._-]{3,50}$/,
      'Usá entre 3 y 50 letras, números, puntos, guiones o guiones bajos',
    ),
  password: z
    .string()
    .refine(
      (value) => value.trim().length >= 8,
      'Usá al menos 8 caracteres sin contar los espacios de los extremos',
    )
    .refine(
      (value) => new TextEncoder().encode(value).length <= 72,
      'La contraseña supera el máximo de 72 bytes',
    ),
});
