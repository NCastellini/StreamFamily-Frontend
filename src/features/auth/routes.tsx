import type { RouteObject } from 'react-router-dom';
import { PlaceholderPage } from '@/app/PlaceholderPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

/**
 * Rutas de la feature auth (Nazareno).
 * Reemplazá los PlaceholderPage por tus páginas. No hace falta tocar el router ni el menú.
 * Son públicas: el router las monta fuera del AppLayout.
 */
export const authRoutes: RouteObject[] = [
  { path: 'login', element: <LoginPage /> },
  { path: 'registro', element: <RegisterPage /> },
  { path: 'recuperar', element: <PlaceholderPage title="Recuperar contraseña" owner="Nazareno" /> },
];
