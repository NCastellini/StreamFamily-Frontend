# src/shared

Piezas comunes para armar listados y páginas de detalle. Componentes desde `@/shared/components`,
hooks desde `@/shared/hooks/*` y utilidades desde `@/shared/utils/*` (`notify`, `format`, `export`).

## Hooks

```ts
useListParams<F>(defaults?) → { params, setPage, setLimit, setSort, toggleSort, setSearch, setFilter, reset }
useApiList(fn, params) → { data, meta, loading, error, reload }
```

- `useListParams` guarda `page`, `limit`, `sortBy`, `order`, `q` y los filtros en la URL. Defaults:
  `page=1`, `limit=10`, `sortBy=id`, `order=desc`. `limit` acepta 10, 20 o 50. Buscar, filtrar,
  ordenar o cambiar `limit` vuelve a la página 1.
- `useApiList` pide de nuevo cuando cambian los params y descarta respuestas viejas. `fn` recibe
  `(params, signal)`. Mientras recarga mantiene la data anterior. No notifica errores: avisalos vos
  con un `useEffect` (ver ejemplo).

## Column\<T>

```ts
{ key, header, sortable?, value: (row) => string | number | null, render?, width?, align?, exportable? }
```

`key` es el `sortBy` que se manda al back. `value` es texto plano (lo usa el export); `render` es
opcional y solo para la tabla. Para la columna de acciones: `exportable: false`.

## Componentes

| Componente       | Props principales                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `DataTable`      | `columns, data, loading, sortBy, order, onSort, onRowClick, rowKey?, emptyMessage?, minWidth?` |
| `ListToolbar`    | `search, filters, actions` (slots)                                                             |
| `SearchBar`      | `value, onChange, placeholder?, debounceMs?` (400 ms)                                          |
| `PageSizeSelect` | `value, onChange, options?`                                                                    |
| `Pagination`     | `page, totalPages, onChange, total?`                                                           |
| `ExportButton`   | `entity, columns, fetchPage, disabled?`                                                        |
| `ConfirmDialog`  | `opened, message, onConfirm, onCancel, title?, confirmLabel?, cancelLabel?, color?, loading?`  |
| `PageHeader`     | `title, description?, actions?`                                                                |
| `Loader`         | `label?`                                                                                       |
| `EmptyState`     | `message, description?, action?`                                                               |
| `ErrorMessage`   | `error, onRetry?, title?` (muestra el `msg` del back si es `ApiError`)                         |

- Los botones, links y switches dentro de un `render` de `DataTable` **no** disparan `onRowClick`.
- `ExportButton`: pasá `fetchPage={(p) => api.list({ ...params, ...p })}` para que respete búsqueda,
  filtros y orden. Exporta todo lo filtrado (de a 100 por página, hasta 100 páginas) a PDF o XLSX y
  avisa si no hay datos.
- `ConfirmDialog`: **no captures el error en `onConfirm`**. Dejalo propagar: el diálogo lo notifica.
- `notifyError(error, fallback?)` muestra el `msg` del back; `notifySuccess(message)` confirma.

## Formatos

`@/shared/utils/format`: `formatMoney(value, 'ARS' | 'USD')`, `formatDate(value)` (`DD/MM/YYYY`) y
`formatDateTime(value)` (`DD/MM/YYYY HH:mm`). Devuelven `null` si el valor falta o es inválido, así
se usan directo en `Column.value`.

## Export

`@/shared/utils/export`: `fetchAllPages(fetchPage, limit?)`, `buildExportTable(columns, rows)`,
`exportFileName(entity, formato)`, `exportToXlsx` y `exportToPdf` (cargan xlsx y jspdf bajo
demanda).

## Ejemplo de ListPage

```tsx
import { useEffect, useState } from 'react';
import { Button, Select } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import {
  ConfirmDialog,
  DataTable,
  ExportButton,
  ListToolbar,
  PageSizeSelect,
  Pagination,
  SearchBar,
} from '@/shared/components';
import type { Column } from '@/shared/components';
import { useApiList } from '@/shared/hooks/useApiList';
import { useListParams } from '@/shared/hooks/useListParams';
import { notifyError, notifySuccess } from '@/shared/utils/notify';
import { alertasApi } from './api';
import { alertaColumns } from './columns';
import type { Alerta, AlertaFilters } from './types';

export function AlertasListPage() {
  const navigate = useNavigate();
  const { params, setPage, setLimit, toggleSort, setSearch, setFilter } =
    useListParams<AlertaFilters>();
  const { data, meta, loading, error, reload } = useApiList(alertasApi.list, params);
  const [aBorrar, setABorrar] = useState<Alerta | null>(null);

  useEffect(() => {
    if (error) notifyError(error);
  }, [error]);

  // Después de borrar el último registro de la última página, ir a la anterior.
  useEffect(() => {
    if (!loading && meta && meta.totalPages > 0 && (params.page ?? 1) > meta.totalPages) {
      setPage(meta.totalPages);
    }
  }, [loading, meta, params.page, setPage]);

  const columns: Column<Alerta>[] = [
    ...alertaColumns,
    {
      key: 'acciones',
      header: '',
      exportable: false,
      value: () => null,
      render: (a) => (
        <Button size="xs" onClick={() => setABorrar(a)}>
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <>
      <ListToolbar
        search={<SearchBar value={params.q ?? ''} onChange={setSearch} />}
        filters={
          <>
            <Select
              label="Estado"
              size="xs"
              clearable
              data={['activa', 'descartada']}
              value={params.estado ?? null}
              onChange={(v) => setFilter('estado', v ?? undefined)}
            />
            <PageSizeSelect value={params.limit ?? 10} onChange={setLimit} />
          </>
        }
        actions={
          <ExportButton
            entity="alertas"
            columns={columns}
            fetchPage={(p) => alertasApi.list({ ...params, ...p })}
          />
        }
      />
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        sortBy={params.sortBy}
        order={params.order}
        onSort={toggleSort}
        onRowClick={(a) => navigate(`/alertas/${a.id}`)}
      />
      <Pagination
        page={params.page ?? 1}
        totalPages={meta?.totalPages ?? 0}
        total={meta?.total}
        onChange={setPage}
      />
      <ConfirmDialog
        opened={aBorrar !== null}
        message={`¿Eliminar la alerta #${aBorrar?.id}?`}
        onCancel={() => setABorrar(null)}
        onConfirm={async () => {
          if (!aBorrar) return;
          await alertasApi.remove(aBorrar.id); // sin try/catch
          notifySuccess('Alerta eliminada');
          setABorrar(null);
          reload();
        }}
      />
    </>
  );
}
```
