import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';
import { AppErrorBoundary } from '@/app/AppErrorBoundary';
import { AuthProvider } from '@/features/auth/AuthProvider';

const theme = createTheme({
  primaryColor: 'violet',
  defaultRadius: 'md',
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-right" />
      <AppErrorBoundary>
        <AuthProvider>{children}</AuthProvider>
      </AppErrorBoundary>
    </MantineProvider>
  );
}
