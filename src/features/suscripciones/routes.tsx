import type { RouteObject } from 'react-router-dom';
import { PlaceholderPage } from '@/app/PlaceholderPage';

/**
 * Rutas de la feature suscripciones (Nicolás).
 * Reemplazá los PlaceholderPage por tus páginas. No hace falta tocar el router ni el menú.
 */
export const suscripcionesRoutes: RouteObject[] = [
  { path: 'suscripciones', element: <PlaceholderPage title="Suscripciones" owner="Nicolás" /> },
  {
    path: 'suscripciones/medios-pago',
    element: <PlaceholderPage title="Medios de pago" owner="Nicolás" />,
  },
];
