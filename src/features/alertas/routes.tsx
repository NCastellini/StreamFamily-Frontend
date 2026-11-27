import type { RouteObject } from 'react-router-dom';
import { PlaceholderPage } from '@/app/PlaceholderPage';

/**
 * Rutas de la feature alertas (Alejo).
 * Reemplazá los PlaceholderPage por tus páginas. No hace falta tocar el router ni el menú.
 */
export const alertasRoutes: RouteObject[] = [
  { path: 'alertas', element: <PlaceholderPage title="Alertas" owner="Alejo" /> },
];
