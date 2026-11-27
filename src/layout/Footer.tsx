import { Group, Text } from '@mantine/core';

export function Footer() {
  return (
    <Group h="100%" px="md" justify="center">
      <Text size="xs" c="dimmed">
        StreamFamily · Grupo 15 · {new Date().getFullYear()}
      </Text>
    </Group>
  );
}
