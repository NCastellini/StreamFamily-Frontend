import type { RouteObject } from 'react-router-dom';
import { PlaceholderPage } from '@/app/PlaceholderPage';

/**
 * Rutas de la feature admin (Román).
 * Reemplazá los PlaceholderPage por tus páginas. No hace falta tocar el router ni el menú.
 */
export const adminRoutes: RouteObject[] = [
  { path: 'admin/metricas', element: <PlaceholderPage title="Métricas" owner="Román" /> },
  { path: 'admin/usuarios', element: <PlaceholderPage title="Usuarios" owner="Román" /> },
  { path: 'admin/categorias', element: <PlaceholderPage title="Categorías" owner="Román" /> },
];
