import type { RouteObject } from 'react-router-dom';
import { PlaceholderPage } from '@/app/PlaceholderPage';
import { LoginPage } from './pages/LoginPage';

/**
 * Rutas de la feature auth (Nazareno).
 * Reemplazá los PlaceholderPage por tus páginas. No hace falta tocar el router ni el menú.
 * Son públicas: el router las monta fuera del AppLayout.
 */
export const authRoutes: RouteObject[] = [
  { path: 'login', element: <LoginPage /> },
  { path: 'registro', element: <PlaceholderPage title="Crear cuenta" owner="Nazareno" /> },
  { path: 'recuperar', element: <PlaceholderPage title="Recuperar contraseña" owner="Nazareno" /> },
];
