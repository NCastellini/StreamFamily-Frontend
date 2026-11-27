import type { RouteObject } from 'react-router-dom';
import { PlaceholderPage } from '@/app/PlaceholderPage';

/**
 * Rutas de la feature perfil (Román).
 * Reemplazá los PlaceholderPage por tus páginas. No hace falta tocar el router ni el menú.
 */
export const perfilRoutes: RouteObject[] = [
  { path: 'perfil', element: <PlaceholderPage title="Perfil" owner="Román" /> },
];
