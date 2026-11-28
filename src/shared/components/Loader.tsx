import { Center, Loader as MantineLoader, Stack, Text } from '@mantine/core';

export type LoaderProps = {
  label?: string;
};

export function Loader({ label }: LoaderProps) {
  return (
    <Center mih={200} py="xl" role="status" aria-label={label ?? 'Cargando'}>
      <Stack align="center" gap="sm">
        <MantineLoader />
        {label && (
          <Text size="sm" c="dimmed">
            {label}
          </Text>
        )}
      </Stack>
    </Center>
  );
}
