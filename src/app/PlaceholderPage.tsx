import { Alert, Stack, Text, Title } from '@mantine/core';

type PlaceholderPageProps = {
  /** Título de la pantalla */
  title: string;
  /** Integrante responsable de la feature */
  owner: string;
};

/** Página temporal: cada dueño la reemplaza en el routes.tsx de su feature. */
export function PlaceholderPage({ title, owner }: PlaceholderPageProps) {
  return (
    <Stack gap="md">
      <Title order={2}>{title}</Title>
      <Alert color="gray" title="En construcción">
        <Text size="sm">Pantalla a cargo de {owner}.</Text>
      </Alert>
    </Stack>
  );
}
