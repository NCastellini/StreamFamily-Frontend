import { Anchor, Stack, Title } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { notifySuccess } from '@/shared/utils/notify';
import { suscripcionesApi } from '../api';
import { SuscripcionForm } from '../components/SuscripcionForm';

export function NuevaSuscripcionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <Stack>
      <Anchor component={Link} to="/suscripciones">
        Volver a suscripciones
      </Anchor>
      <Title order={1}>Nueva suscripción</Title>
      <SuscripcionForm
        usuarioId={user.id}
        onCancel={() => navigate('/suscripciones')}
        onSave={async (input) => {
          const { data, msg } = await suscripcionesApi.create(input);
          notifySuccess(msg);
          navigate(`/suscripciones/${data.id}`, { replace: true });
        }}
      />
    </Stack>
  );
}
