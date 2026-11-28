import { useEffect } from 'react';
import { Alert, Button, Group, Stack, Title } from '@mantine/core';
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
import { gruposApi, listarParaExportar } from '../api';
import { grupoColumns } from '../columns';

export function GruposListPage() {
  const navigate = useNavigate();
  const origen = useOrigenListado();
  const { params, setPage, setLimit, setSearch, toggleSort } = useListParams();
  const { data, meta, error, loading, reload } = useApiList(gruposApi.list, params);
  useEffect(() => {
    if (!loading && !error && meta && (params.page ?? 1) > Math.max(1, meta.totalPages))
      setPage(Math.max(1, meta.totalPages));
  }, [params.page, meta, error, loading, setPage]);
  return (
    <Stack>
      <Group justify="space-between">
        <Title order={1}>Grupos familiares</Title>
        <Button component={Link} to="/grupos/nueva">
          Crear grupo
        </Button>
      </Group>
      <ListToolbar
        search={
          <SearchBar value={params.q ?? ''} onChange={setSearch} placeholder="Buscar por nombre" />
        }
        filters={<PageSizeSelect value={params.limit ?? 10} onChange={setLimit} />}
        actions={
          <ExportButton
            entity="grupos"
            columns={grupoColumns}
            fetchPage={() => listarParaExportar(params)}
            disabled={loading || !!error || !data.length}
          />
        }
      />
      {error ? (
        <Alert color="red" title={error.msg}>
          <Button variant="light" onClick={reload}>
            Reintentar
          </Button>
        </Alert>
      ) : (
        <DataTable
          columns={grupoColumns}
          data={data}
          loading={loading}
          sortBy={params.sortBy}
          order={params.order}
          onSort={toggleSort}
          onRowClick={(grupo) => navigate(`/grupos/${grupo.id}`, { state: origen })}
          emptyMessage={
            params.q
              ? 'No se encontraron grupos para esa búsqueda'
              : 'Todavía no pertenecés a ningún grupo'
          }
        />
      )}
      <Pagination
        page={params.page ?? 1}
        totalPages={meta?.totalPages ?? 0}
        total={meta?.total}
        onChange={setPage}
      />
    </Stack>
  );
}
