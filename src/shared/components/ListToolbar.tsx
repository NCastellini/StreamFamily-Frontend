import type { ReactNode } from 'react';
import { Box, Group } from '@mantine/core';

export type ListToolbarProps = {
  search?: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
};

export function ListToolbar({ search, filters, actions }: ListToolbarProps) {
  return (
    <Group justify="space-between" align="flex-end" gap="sm">
      <Box flex="1 1 240px" maw={400}>
        {search}
      </Box>
      <Group gap="sm" align="flex-end">
        {filters}
        {actions}
      </Group>
    </Group>
  );
}
