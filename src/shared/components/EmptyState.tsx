import type { ReactNode } from 'react';
import { Box, Stack, Text } from '@mantine/core';

export type EmptyStateProps = {
  message: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ message, description, action }: EmptyStateProps) {
  return (
    <Stack align="center" gap="xs" py="xl" ta="center">
      <Text c="dimmed" fw={500}>
        {message}
      </Text>
      {description && (
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      )}
      {action && <Box mt="sm">{action}</Box>}
    </Stack>
  );
}
