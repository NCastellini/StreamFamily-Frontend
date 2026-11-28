import type { KeyboardEvent, MouseEvent, SyntheticEvent } from 'react';
import { Box, Group, LoadingOverlay, Skeleton, Table, Text, UnstyledButton } from '@mantine/core';
import type { SortOrder } from '@/shared/types/api.types';
import type { Column } from './types';

export type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  sortBy?: string;
  order?: SortOrder;
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  rowKey?: (row: T) => string | number;
  emptyMessage?: string;
  minWidth?: number;
};

const FILAS_SKELETON = 5;
const SIN_VALOR = '—';
// label incluido: el track del Switch de Mantine es un span dentro de un <label>
const SELECTOR_INTERACTIVO =
  'button, a, input, select, textarea, label, [role="button"], [role="switch"], [role="checkbox"]';

function vieneDeInteractivo(e: SyntheticEvent<HTMLElement>): boolean {
  if (!(e.target instanceof Element)) return false;
  const el = e.target.closest(SELECTOR_INTERACTIVO);
  return el !== null && el !== e.currentTarget && e.currentTarget.contains(el);
}

function claveFila<T>(fila: T, indice: number): string | number {
  const id = (fila as { id?: unknown }).id;
  return typeof id === 'string' || typeof id === 'number' ? id : indice;
}

function ordenAria(activa: boolean, order?: SortOrder): 'ascending' | 'descending' | undefined {
  if (!activa) return undefined;
  return order === 'asc' ? 'ascending' : 'descending';
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  sortBy,
  order,
  onSort,
  onRowClick,
  rowKey,
  emptyMessage = 'No hay resultados',
  minWidth = 600,
}: DataTableProps<T>) {
  const sinData = data.length === 0;

  const encabezados = columns.map((col) => {
    const activa = col.key === sortBy;
    const ordenable = Boolean(col.sortable && onSort);
    const flecha = activa ? (order === 'asc' ? '▲' : '▼') : '';

    return (
      <Table.Th
        key={col.key}
        style={{ width: col.width, textAlign: col.align }}
        aria-sort={ordenable ? ordenAria(activa, order) : undefined}
      >
        {ordenable ? (
          <UnstyledButton onClick={() => onSort?.(col.key)} fw={600} fz="sm">
            <Group gap={4} wrap="nowrap">
              {col.header}
              <Text span fz="xs" c={activa ? undefined : 'dimmed'} aria-hidden>
                {flecha || '↕'}
              </Text>
            </Group>
          </UnstyledButton>
        ) : (
          col.header
        )}
      </Table.Th>
    );
  });

  let filas;
  if (sinData && loading) {
    filas = Array.from({ length: FILAS_SKELETON }, (_, i) => (
      <Table.Tr key={`skeleton-${i}`}>
        {columns.map((col) => (
          <Table.Td key={col.key}>
            <Skeleton height={14} radius="sm" />
          </Table.Td>
        ))}
      </Table.Tr>
    ));
  } else if (sinData) {
    filas = (
      <Table.Tr>
        <Table.Td colSpan={columns.length}>
          <Text ta="center" c="dimmed" py="md">
            {emptyMessage}
          </Text>
        </Table.Td>
      </Table.Tr>
    );
  } else {
    filas = data.map((fila, i) => {
      const alHacerClic = (e: MouseEvent<HTMLTableRowElement>) => {
        if (!vieneDeInteractivo(e)) onRowClick?.(fila);
      };
      const alPresionarTecla = (e: KeyboardEvent<HTMLTableRowElement>) => {
        if (e.key === 'Enter' && !vieneDeInteractivo(e)) onRowClick?.(fila);
      };

      return (
        <Table.Tr
          key={rowKey ? rowKey(fila) : claveFila(fila, i)}
          onClick={onRowClick ? alHacerClic : undefined}
          onKeyDown={onRowClick ? alPresionarTecla : undefined}
          tabIndex={onRowClick ? 0 : undefined}
          style={onRowClick ? { cursor: 'pointer' } : undefined}
        >
          {columns.map((col) => (
            <Table.Td key={col.key} style={{ textAlign: col.align }}>
              {col.render ? col.render(fila) : (col.value(fila) ?? SIN_VALOR)}
            </Table.Td>
          ))}
        </Table.Tr>
      );
    });
  }

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading && !sinData} overlayProps={{ blur: 1 }} />
      <Table.ScrollContainer minWidth={minWidth}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>{encabezados}</Table.Tr>
          </Table.Thead>
          <Table.Tbody>{filas}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  );
}
