import { Container, Paper, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

export function AuthPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Container component="main" size={460} py={{ base: 'xl', sm: 64 }}>
      <Paper p={{ base: 'lg', sm: 'xl' }} withBorder>
        <Stack gap="lg">
          <div>
            <Text c="violet" fw={700}>
              StreamFamily
            </Text>
            <Title order={1} size="h2">
              {title}
            </Title>
          </div>
          {children}
        </Stack>
      </Paper>
    </Container>
  );
}
