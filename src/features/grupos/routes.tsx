import type { RouteObject } from 'react-router-dom';
import { GruposListPage } from './pages/ListPage';
import { GrupoDetailPage } from './pages/DetailPage';
import { NuevoGrupoPage } from './pages/NewPage';

export const gruposRoutes: RouteObject[] = [
  { path: 'grupos', element: <GruposListPage /> },
  { path: 'grupos/nueva', element: <NuevoGrupoPage /> },
  { path: 'grupos/:id', element: <GrupoDetailPage /> },
];
