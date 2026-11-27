import type { RouteObject } from 'react-router-dom';
import { PlaceholderPage } from '@/app/PlaceholderPage';

/**
 * Rutas de la feature pagos (Julián).
 * Reemplazá los PlaceholderPage por tus páginas. No hace falta tocar el router ni el menú.
 */
export const pagosRoutes: RouteObject[] = [
  { path: 'pagos', element: <PlaceholderPage title="Historial de pagos" owner="Julián" /> },
];
