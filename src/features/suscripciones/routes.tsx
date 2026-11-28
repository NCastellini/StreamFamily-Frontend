import type { RouteObject } from 'react-router-dom';
import { SuscripcionDetailPage } from './pages/DetailPage';
import { SuscripcionesListPage } from './pages/ListPage';
import { MediosPagoPage } from './pages/MediosPagoPage';
import { NuevaSuscripcionPage } from './pages/NewPage';

export const suscripcionesRoutes: RouteObject[] = [
  { path: 'suscripciones', element: <SuscripcionesListPage /> },
  { path: 'suscripciones/nueva', element: <NuevaSuscripcionPage /> },
  { path: 'suscripciones/medios-pago', element: <MediosPagoPage /> },
  { path: 'suscripciones/:id', element: <SuscripcionDetailPage /> },
];
