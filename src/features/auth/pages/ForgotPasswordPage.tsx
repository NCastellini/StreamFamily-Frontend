import { Alert, Anchor, Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { authApi } from '../api';
import { AuthPanel } from '../components/AuthPanel';
import { emailSchema } from '../schema';
import { useAuthSubmit } from '../useAuthSubmit';

const schema = z.object({ email: emailSchema });

export function ForgotPasswordPage() {
  const [confirmation, setConfirmation] = useState('');
  const form = useForm({ initialValues: { email: '' }, validate: zod4Resolver(schema) });
  const { submit, pending } = useAuthSubmit(async ({ email }: typeof form.values) => {
    const { msg } = await authApi.recover(email);
    setConfirmation(msg);
  });

  return (
    <AuthPanel title="Recuperar contraseña">
      {confirmation ? (
        <Alert color="green" title="Solicitud simulada">
          {confirmation}
        </Alert>
      ) : (
        <form onSubmit={form.onSubmit(submit)} noValidate>
          <Stack>
            <TextInput
              label="Email"
              type="email"
              autoComplete="email"
              required
              {...form.getInputProps('email')}
            />
            <Button type="submit" loading={pending}>
              Solicitar recuperación
            </Button>
          </Stack>
        </form>
      )}
      <Anchor component={Link} to="/login">
        Volver al inicio de sesión
      </Anchor>
    </AuthPanel>
  );
}
