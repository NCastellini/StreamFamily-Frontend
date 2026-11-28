import { Button, Center, Group, Stack, Text, Title } from '@mantine/core';

/**
 * Pantalla para errores inesperados. Puede mostrarse fuera del router
 * (si falla un provider), por eso navega con window.location y no con Link.
 */
export function ErrorPage() {
  return (
    <Center mih="70vh" p="md">
      <Stack align="center" gap="sm" maw={420}>
        <Title order={2}>Algo salió mal</Title>
        <Text c="dimmed" ta="center">
          Ocurrió un error inesperado. Probá recargar la página; si sigue pasando, volvé a intentar
          más tarde.
        </Text>
        <Group>
          <Button onClick={() => window.location.reload()}>Recargar</Button>
          <Button variant="default" onClick={() => window.location.assign('/')}>
            Ir al inicio
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}
