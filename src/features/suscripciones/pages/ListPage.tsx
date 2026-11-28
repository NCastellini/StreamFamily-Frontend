import { useEffect, useMemo } from 'react';
import { Button, Group, Select, Stack, Title } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import {
  DataTable,
  ExportButton,
  ListToolbar,
  PageSizeSelect,
  Pagination,
  SearchBar,
} from '@/shared/components';
import { useApiList } from '@/shared/hooks/useApiList';
import { useOrigenListado } from '@/shared/hooks/useListadoOrigen';
import { useListParams } from '@/shared/hooks/useListParams';
import { notifyError } from '@/shared/utils/notify';
import { suscripcionesApi } from '../api';
import { suscripcionColumns } from '../columns';
import { ESTADOS, FRECUENCIAS, MONEDAS } from '../types';
import type { SuscripcionFilters } from '../types';
import { useOpciones } from '../useOpciones';

export function SuscripcionesListPage() {
  const navigate = useNavigate();
  const origen = useOrigenListado();
  const { params, setPage, setLimit, toggleSort, setSearch, setFilter } =
    useListParams<SuscripcionFilters>();
  const { data, meta, loading, error } = useApiList(suscripcionesApi.list, params);
  const { categorias } = useOpciones();
  const columns = useMemo(() => suscripcionColumns(categorias), [categorias]);

  useEffect(() => {
    if (error) notifyError(error);
  }, [error]);

  // Si un filtro deja menos páginas que la actual, volver a la última.
  useEffect(() => {
    if (!loading && meta && meta.totalPages > 0 && (params.page ?? 1) > meta.totalPages) {
      setPage(meta.totalPages);
    }
  }, [loading, meta, params.page, setPage]);

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={1}>Suscripciones</Title>
        <Button component={Link} to="/suscripciones/nueva">
          Nueva suscripción
        </Button>
      </Group>
      <ListToolbar
        search={
          <SearchBar
            value={params.q ?? ''}
            onChange={setSearch}
            placeholder="Buscar por plataforma o plan"
          />
        }
        filters={
          <>
            <Select
              label="Estado"
              size="xs"
              clearable
              data={ESTADOS}
              value={params.estado ?? null}
              onChange={(v) => setFilter('estado', v ?? undefined)}
            />
            <Select
              label="Moneda"
              size="xs"
              clearable
              data={MONEDAS}
              value={params.moneda ?? null}
              onChange={(v) => setFilter('moneda', v ?? undefined)}
            />
            <Select
              label="Frecuencia"
              size="xs"
              clearable
              data={FRECUENCIAS}
              value={params.frecuencia ?? null}
              onChange={(v) => setFilter('frecuencia', v ?? undefined)}
            />
            <Select
              label="Categoría"
              size="xs"
              clearable
              data={categorias.map((c) => ({ value: String(c.id), label: c.nombre }))}
              value={params.categoriaId ?? null}
              onChange={(v) => setFilter('categoriaId', v ?? undefined)}
            />
            <PageSizeSelect value={params.limit ?? 10} onChange={setLimit} />
          </>
        }
        actions={
          <ExportButton
            entity="suscripciones"
            columns={columns}
            fetchPage={(p) => suscripcionesApi.list({ ...params, ...p })}
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
        onRowClick={(s) => navigate(`/suscripciones/${s.id}`, { state: origen })}
        emptyMessage="No hay suscripciones para mostrar"
      />
      <Pagination
        page={params.page ?? 1}
        totalPages={meta?.totalPages ?? 0}
        total={meta?.total}
        onChange={setPage}
      />
    </Stack>
  );
}
