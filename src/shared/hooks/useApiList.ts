import { useCallback, useEffect, useEffectEvent, useState } from 'react';
import { ApiError, isApiError } from '@/shared/api/ApiError';
import type { ApiResponse, PaginationMeta } from '@/shared/types/api.types';

type EstadoListado<T> = {
  /** Clave del pedido que produjo este estado (null = todavía ninguno). */
  clave: string | null;
  data: T[];
  meta: PaginationMeta | null;
  error: ApiError | null;
};

const MSG_ERROR_GENERICO = 'Ocurrió un error inesperado';

function esAbortError(e: unknown): boolean {
  return typeof e === 'object' && e !== null && (e as { name?: unknown }).name === 'AbortError';
}

function aApiError(e: unknown): ApiError {
  if (isApiError(e)) return e;
  return new ApiError(e instanceof Error && e.message ? e.message : MSG_ERROR_GENERICO, 0, 0);
}

/**
 * Pide un listado al back y se vuelve a pedir cuando cambian los params (por contenido).
 * Aborta el pedido anterior y mantiene la data previa mientras carga.
 *
 * @example
 * const { params, setPage } = useListParams<AlertaFilters>();
 * const { data, meta, loading } = useApiList(alertasApi.list, params);
 */
export function useApiList<T, P>(
  fn: (params: P, signal?: AbortSignal) => Promise<ApiResponse<T[]>>,
  params: P,
): {
  data: T[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: ApiError | null;
  reload: () => void;
} {
  const claveParams = JSON.stringify(params) ?? '';
  const [recargas, setRecargas] = useState(0);
  const clavePedido = `${recargas}|${claveParams}`;

  const [estado, setEstado] = useState<EstadoListado<T>>({
    clave: null,
    data: [],
    meta: null,
    error: null,
  });

  // Siempre usa la última fn sin que su identidad dispare pedidos.
  const pedirListado = useEffectEvent((p: P, signal: AbortSignal) => fn(p, signal));

  useEffect(() => {
    const controlador = new AbortController();
    const clave = `${recargas}|${claveParams}`;
    // Los params se reconstruyen desde la clave para depender solo de su contenido.
    const p = (claveParams ? JSON.parse(claveParams) : undefined) as P;

    pedirListado(p, controlador.signal).then(
      (res) => {
        if (controlador.signal.aborted) return;
        setEstado({ clave, data: res.data ?? [], meta: res.meta ?? null, error: null });
      },
      (e: unknown) => {
        if (controlador.signal.aborted || esAbortError(e)) return;
        setEstado((previo) => ({ ...previo, clave, error: aApiError(e) }));
      },
    );

    return () => controlador.abort();
  }, [claveParams, recargas]);

  const reload = useCallback(() => setRecargas((n) => n + 1), []);

  return {
    data: estado.data,
    meta: estado.meta,
    loading: estado.clave !== clavePedido,
    error: estado.error,
    reload,
  };
}
