import type { ReactNode } from 'react';
import { Box, Flex, Group, Text, Title } from '@mantine/core';

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      justify="space-between"
      align={{ base: 'stretch', sm: 'flex-start' }}
      gap="sm"
    >
      <Box>
        <Title order={2}>{title}</Title>
        {description && (
          <Text c="dimmed" size="sm">
            {description}
          </Text>
        )}
      </Box>
      {actions && <Group gap="sm">{actions}</Group>}
    </Flex>
  );
}
