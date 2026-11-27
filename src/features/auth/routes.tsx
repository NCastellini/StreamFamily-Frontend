import type { RouteObject } from 'react-router-dom';
import { PlaceholderPage } from '@/app/PlaceholderPage';

/**
 * Rutas de la feature auth (Nazareno).
 * Reemplazá los PlaceholderPage por tus páginas. No hace falta tocar el router ni el menú.
 * Son públicas: el router las monta fuera del AppLayout.
 */
export const authRoutes: RouteObject[] = [
  { path: 'login', element: <PlaceholderPage title="Iniciar sesión" owner="Nazareno" /> },
  { path: 'registro', element: <PlaceholderPage title="Crear cuenta" owner="Nazareno" /> },
  { path: 'recuperar', element: <PlaceholderPage title="Recuperar contraseña" owner="Nazareno" /> },
];
