import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Center mih="70vh">
      <Stack align="center" gap="sm">
        <Title order={1}>404</Title>
        <Text c="dimmed">La página que buscás no existe.</Text>
        <Button component={Link} to="/">
          Volver al inicio
        </Button>
      </Stack>
    </Center>
  );
}
