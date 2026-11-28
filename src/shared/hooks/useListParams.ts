import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SortOrder } from '@/shared/types/api.types';
import type { ListParams } from '@/shared/types/list.types';

type ParamsBase = {
  page: number;
  limit: number;
  sortBy: string;
  order: SortOrder;
  q?: string;
};

type ValorUrl = string | number | undefined;

const CLAVES_BASE = ['page', 'limit', 'sortBy', 'order', 'q'] as const;
const LIMITES_PERMITIDOS = [10, 20, 50];
const VALORES_POR_DEFECTO: ParamsBase = { page: 1, limit: 10, sortBy: 'id', order: 'desc' };

function esClaveBase(clave: string): boolean {
  return (CLAVES_BASE as readonly string[]).includes(clave);
}

function parsearPagina(valor: string | null, porDefecto: number): number {
  const n = Number(valor);
  return valor !== null && Number.isInteger(n) && n >= 1 ? n : porDefecto;
}

function parsearLimite(valor: string | null, porDefecto: number): number {
  const n = Number(valor);
  return valor !== null && LIMITES_PERMITIDOS.includes(n) ? n : porDefecto;
}

function parsearOrden(valor: string | null, porDefecto: SortOrder): SortOrder {
  return valor === 'asc' || valor === 'desc' ? valor : porDefecto;
}

/**
 * Estado de un listado (paginación, orden, búsqueda y filtros) guardado en la URL.
 * Los valores iguales al default o vacíos no se escriben en la URL.
 * Todo parámetro de la URL que no sea page/limit/sortBy/order/q se toma como filtro.
 *
 * @example
 * const { params, setPage } = useListParams<AlertaFilters>();
 * const { data, meta, loading } = useApiList(alertasApi.list, params);
 */
export function useListParams<F extends Record<string, string | undefined> = Record<never, never>>(
  defaults?: ListParams<F>,
): {
  params: ListParams<F>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSort: (sortBy: string, order?: SortOrder) => void;
  toggleSort: (sortBy: string) => void;
  setSearch: (q: string) => void;
  setFilter: (key: keyof F, value: string | undefined) => void;
  reset: () => void;
} {
  const [searchParams, setSearchParams] = useSearchParams();

  // Se compara por contenido para que un objeto literal no rompa la memoización.
  const claveDefaults = JSON.stringify(defaults ?? {});
  const porDefecto = useMemo<Record<string, ValorUrl>>(
    () => ({
      ...VALORES_POR_DEFECTO,
      ...(JSON.parse(claveDefaults) as Record<string, ValorUrl>),
    }),
    [claveDefaults],
  );

  const busqueda = searchParams.toString();
  const params = useMemo(() => {
    const url = new URLSearchParams(busqueda);
    const resultado: Record<string, ValorUrl> = {};

    // Filtros: primero los defaults, después los de la URL.
    for (const [clave, valor] of Object.entries(porDefecto)) {
      if (!esClaveBase(clave) && valor !== undefined && valor !== '') resultado[clave] = valor;
    }
    for (const [clave, valor] of url) {
      if (!esClaveBase(clave) && valor !== '') resultado[clave] = valor;
    }

    resultado.page = parsearPagina(url.get('page'), Number(porDefecto.page));
    resultado.limit = parsearLimite(url.get('limit'), Number(porDefecto.limit));
    resultado.sortBy = url.get('sortBy') || String(porDefecto.sortBy);
    resultado.order = parsearOrden(url.get('order'), porDefecto.order as SortOrder);
    const q = url.get('q') || (porDefecto.q === undefined ? '' : String(porDefecto.q));
    if (q) resultado.q = q;

    return resultado as ListParams<F>;
  }, [busqueda, porDefecto]);

  const actualizarUrl = useCallback(
    (cambios: Record<string, ValorUrl>, { volverAPagina1 = true, replace = false } = {}) => {
      setSearchParams(
        (previo) => {
          const siguiente = new URLSearchParams(previo);
          const todos = volverAPagina1 ? { ...cambios, page: 1 } : cambios;
          for (const [clave, valor] of Object.entries(todos)) {
            const texto = valor === undefined ? '' : String(valor).trim();
            const def = porDefecto[clave] === undefined ? '' : String(porDefecto[clave]);
            if (texto === '' || texto === def) siguiente.delete(clave);
            else siguiente.set(clave, texto);
          }
          return siguiente;
        },
        { replace },
      );
    },
    [setSearchParams, porDefecto],
  );

  const setPage = useCallback(
    (page: number) => actualizarUrl({ page }, { volverAPagina1: false }),
    [actualizarUrl],
  );

  const setLimit = useCallback((limit: number) => actualizarUrl({ limit }), [actualizarUrl]);

  const setSort = useCallback(
    (sortBy: string, order?: SortOrder) =>
      actualizarUrl({ sortBy, order: order ?? porDefecto.order }),
    [actualizarUrl, porDefecto],
  );

  const toggleSort = useCallback(
    (sortBy: string) => {
      const mismaColumna = params.sortBy === sortBy;
      const order: SortOrder = mismaColumna && params.order === 'desc' ? 'asc' : 'desc';
      actualizarUrl({ sortBy, order });
    },
    [actualizarUrl, params.sortBy, params.order],
  );

  const setSearch = useCallback(
    (q: string) => actualizarUrl({ q }, { replace: true }),
    [actualizarUrl],
  );

  const setFilter = useCallback(
    (key: keyof F, value: string | undefined) =>
      actualizarUrl({ [String(key)]: value }, { replace: true }),
    [actualizarUrl],
  );

  const reset = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams]);

  return { params, setPage, setLimit, setSort, toggleSort, setSearch, setFilter, reset };
}
