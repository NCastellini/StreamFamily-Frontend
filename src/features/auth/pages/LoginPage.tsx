import { Anchor, Button, Group, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { AuthPanel } from '../components/AuthPanel';
import { useAuth } from '../useAuth';
import { useAuthSubmit } from '../useAuthSubmit';

const schema = z.object({
  identifier: z.string().trim().min(1, 'Ingresá tu usuario o email'),
  password: z.string().refine((value) => value.trim().length > 0, 'Ingresá tu contraseña'),
});

export function LoginPage() {
  const { login } = useAuth();
  const { submit, pending } = useAuthSubmit(login);
  const form = useForm({
    initialValues: { identifier: '', password: '' },
    validate: zod4Resolver(schema),
  });

  return (
    <AuthPanel title="Iniciar sesión">
      <form onSubmit={form.onSubmit(submit)} noValidate>
        <Stack>
          <TextInput
            label="Usuario o email"
            autoComplete="username"
            required
            {...form.getInputProps('identifier')}
          />
          <PasswordInput
            label="Contraseña"
            autoComplete="current-password"
            required
            {...form.getInputProps('password')}
          />
          <Button type="submit" loading={pending}>
            Iniciar sesión
          </Button>
        </Stack>
      </form>
      <Group justify="space-between">
        <Anchor component={Link} to="/registro">
          Crear cuenta
        </Anchor>
        <Anchor component={Link} to="/recuperar">
          Olvidé mi contraseña
        </Anchor>
      </Group>
    </AuthPanel>
  );
}
