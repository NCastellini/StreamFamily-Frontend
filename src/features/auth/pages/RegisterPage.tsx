import { Alert, Anchor, Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api';
import { AuthPanel } from '../components/AuthPanel';
import { registerSchema } from '../schema';
import { useAuthSubmit } from '../useAuthSubmit';

export function RegisterPage() {
  const [confirmation, setConfirmation] = useState('');
  const form = useForm({
    initialValues: { nombre: '', apellido: '', email: '', username: '', password: '' },
    validate: zod4Resolver(registerSchema),
  });
  const { submit, pending } = useAuthSubmit(async (values: typeof form.values) => {
    const { msg } = await authApi.register(values);
    form.reset();
    setConfirmation(msg);
  });

  return (
    <AuthPanel title="Crear cuenta">
      {confirmation ? (
        <Alert color="green" title={confirmation}>
          El registro es de demostración. Para ingresar, usá una cuenta de prueba.
        </Alert>
      ) : (
        <form onSubmit={form.onSubmit(submit)} noValidate>
          <Stack>
            <TextInput
              label="Nombre"
              autoComplete="given-name"
              required
              {...form.getInputProps('nombre')}
            />
            <TextInput
              label="Apellido"
              autoComplete="family-name"
              required
              {...form.getInputProps('apellido')}
            />
            <TextInput
              label="Email"
              type="email"
              autoComplete="email"
              required
              {...form.getInputProps('email')}
            />
            <TextInput
              label="Usuario"
              autoComplete="username"
              autoCapitalize="none"
              required
              {...form.getInputProps('username')}
            />
            <PasswordInput
              label="Contraseña"
              autoComplete="new-password"
              required
              {...form.getInputProps('password')}
            />
            <Button type="submit" loading={pending}>
              Registrarme
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
