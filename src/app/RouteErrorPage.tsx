import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';
import { ErrorPage } from '@/app/ErrorPage';

/** Se muestra cuando falla una pantalla dentro del router. */
export function RouteErrorPage() {
  const error = useRouteError();

  useEffect(() => {
    console.error('Error en una pantalla', error);
  }, [error]);

  return <ErrorPage />;
}
