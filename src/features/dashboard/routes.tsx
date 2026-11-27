import type { RouteObject } from 'react-router-dom';
import { PlaceholderPage } from '@/app/PlaceholderPage';

/**
 * Rutas de la feature dashboard (Julián).
 * Reemplazá los PlaceholderPage por tus páginas. No hace falta tocar el router ni el menú.
 */
export const dashboardRoutes: RouteObject[] = [
  { index: true, element: <PlaceholderPage title="Inicio" owner="Julián" /> },
];
