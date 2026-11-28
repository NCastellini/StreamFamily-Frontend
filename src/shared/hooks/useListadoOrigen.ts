import { useLocation } from 'react-router-dom';

type EstadoOrigen = { listado?: unknown } | null;

/**
 * Estado para navegar de un listado a su detalle recordando la URL actual
 * (búsqueda, página, orden, tamaño de página y filtros).
 * Uso: navigate(`/grupos/${id}`, { state: origen })
 */
export function useOrigenListado() {
  const { pathname, search } = useLocation();
  return { listado: pathname + search };
}

/**
 * URL a la que vuelve un detalle: el listado desde el que se abrió o,
 * si se entró por un enlace directo, el listado base (por ejemplo /grupos).
 */
export function useVolverAlListado(base: string) {
  const { state } = useLocation();
  const listado = (state as EstadoOrigen)?.listado;
  const esDelListado =
    typeof listado === 'string' && (listado === base || listado.startsWith(`${base}?`));
  return esDelListado ? listado : base;
}
