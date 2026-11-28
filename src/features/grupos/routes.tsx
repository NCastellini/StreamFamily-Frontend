import type { RouteObject } from 'react-router-dom';
import { GruposListPage } from './pages/ListPage';

export const gruposRoutes: RouteObject[] = [{ path: 'grupos', element: <GruposListPage /> }];
