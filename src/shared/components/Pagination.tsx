import { Group, Pagination as MantinePagination, Text } from '@mantine/core';

export type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  total?: number;
};

export function Pagination({ page, totalPages, onChange, total }: PaginationProps) {
  const conPaginas = totalPages > 1;
  if (!conPaginas && total === undefined) return null;

  return (
    <Group justify="space-between" gap="sm">
      {total !== undefined && (
        <Text size="sm" c="dimmed">
          {total.toLocaleString('es-AR')} {total === 1 ? 'resultado' : 'resultados'}
        </Text>
      )}
      {conPaginas && (
        <MantinePagination value={page} total={totalPages} onChange={onChange} ml="auto" />
      )}
    </Group>
  );
}
