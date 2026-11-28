import { useEffect, useState } from 'react';
import { Button, Group, Modal, Stack, Title } from '@mantine/core';
import {
  ConfirmDialog,
  DataTable,
  ListToolbar,
  PageSizeSelect,
  Pagination,
  SearchBar,
} from '@/shared/components';
import type { Column } from '@/shared/components';
import { useApiList } from '@/shared/hooks/useApiList';
import { useListParams } from '@/shared/hooks/useListParams';
import { notifyError, notifySuccess } from '@/shared/utils/notify';
import { mediosPagoApi } from '../api';
import { MedioPagoForm } from '../components/MedioPagoForm';
import { labelTipoMedioPago } from '../format';
import type { MedioPago } from '../types';

export function MediosPagoPage() {
  const { params, setPage, setLimit, toggleSort, setSearch } = useListParams();
  const { data, meta, loading, error, reload } = useApiList(mediosPagoApi.list, params);
  // undefined: cerrado · null: alta · MedioPago: edición
  const [editando, setEditando] = useState<MedioPago | null | undefined>(undefined);
  const [aBorrar, setABorrar] = useState<MedioPago | null>(null);

  useEffect(() => {
    if (error) notifyError(error);
  }, [error]);

  useEffect(() => {
    if (!loading && meta && meta.totalPages > 0 && (params.page ?? 1) > meta.totalPages) {
      setPage(meta.totalPages);
    }
  }, [loading, meta, params.page, setPage]);

  const columns: Column<MedioPago>[] = [
    { key: 'nombre', header: 'Nombre', sortable: true, value: (m) => m.nombre },
    { key: 'tipo', header: 'Tipo', sortable: true, value: (m) => labelTipoMedioPago(m.tipo) },
    {
      key: 'acciones',
      header: '',
      exportable: false,
      align: 'right',
      value: () => null,
      render: (m) => (
        <Group gap="xs" justify="flex-end">
          <Button size="xs" variant="light" onClick={() => setEditando(m)}>
            Editar
          </Button>
          <Button size="xs" variant="light" color="red" onClick={() => setABorrar(m)}>
            Eliminar
          </Button>
        </Group>
      ),
    },
  ];

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={1}>Medios de pago</Title>
        <Button onClick={() => setEditando(null)}>Nuevo medio de pago</Button>
      </Group>
      <ListToolbar
        search={
          <SearchBar value={params.q ?? ''} onChange={setSearch} placeholder="Buscar por nombre" />
        }
        filters={<PageSizeSelect value={params.limit ?? 10} onChange={setLimit} />}
      />
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        sortBy={params.sortBy}
        order={params.order}
        onSort={toggleSort}
        onRowClick={(m) => setEditando(m)}
        emptyMessage="No hay medios de pago cargados"
      />
      <Pagination
        page={params.page ?? 1}
        totalPages={meta?.totalPages ?? 0}
        total={meta?.total}
        onChange={setPage}
      />

      <Modal
        opened={editando !== undefined}
        onClose={() => setEditando(undefined)}
        title={editando ? 'Editar medio de pago' : 'Nuevo medio de pago'}
      >
        {editando !== undefined && (
          <MedioPagoForm
            key={editando?.id ?? 'nuevo'}
            medio={editando ?? undefined}
            onCancel={() => setEditando(undefined)}
            onSave={async (input) => {
              const res = editando
                ? await mediosPagoApi.update(editando.id, input)
                : await mediosPagoApi.create(input);
              notifySuccess(res.msg);
              setEditando(undefined);
              reload();
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        opened={aBorrar !== null}
        title="Eliminar medio de pago"
        message={`¿Eliminar «${aBorrar?.nombre}»? Si hay suscripciones que lo usan, no se va a poder eliminar.`}
        onCancel={() => setABorrar(null)}
        onConfirm={async () => {
          if (!aBorrar) return;
          const res = await mediosPagoApi.remove(aBorrar.id);
          notifySuccess(res.msg);
          setABorrar(null);
          reload();
        }}
      />
    </Stack>
  );
}
