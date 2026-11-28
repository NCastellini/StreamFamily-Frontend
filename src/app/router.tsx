import { createBrowserRouter, Navigate } from 'react-router-dom';
import { NotFoundPage } from '@/app/NotFoundPage';
import { RouteErrorPage } from '@/app/RouteErrorPage';
import { adminRoutes } from '@/features/admin/routes';
import { alertasRoutes } from '@/features/alertas/routes';
import { authRoutes } from '@/features/auth/routes';
import { GuestOnly, RequireAuth, RequireRole } from '@/features/auth/guards';
import { dashboardRoutes } from '@/features/dashboard/routes';
import { gruposRoutes } from '@/features/grupos/routes';
import { pagosRoutes } from '@/features/pagos/routes';
import { perfilRoutes } from '@/features/perfil/routes';
import { suscripcionesRoutes } from '@/features/suscripciones/routes';
import { AppLayout } from '@/layout/AppLayout';

/**
 * Router de la app. Cada feature exporta sus rutas desde su propio routes.tsx:
 * para agregar o cambiar pantallas, cada dueño edita solo ese archivo.
 *
 * - authRoutes: pantallas públicas, sin el layout (login, registro, recuperar).
 * - El resto va dentro del AppLayout (header, menú y footer).
 * - errorElement: si una pantalla falla, se muestra RouteErrorPage en vez de quedar en blanco.
 */
export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    children: [
      { element: <GuestOnly />, children: authRoutes },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AppLayout />,
            children: [
              ...perfilRoutes,
              { element: <RequireRole role="admin" />, children: adminRoutes },
              {
                element: <RequireRole role="cliente" />,
                children: [
                  { index: true, element: <Navigate to="/dashboard" replace /> },
                  { path: 'dashboard', children: dashboardRoutes },
                  ...suscripcionesRoutes,
                  ...gruposRoutes,
                  ...pagosRoutes,
                  ...alertasRoutes,
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
