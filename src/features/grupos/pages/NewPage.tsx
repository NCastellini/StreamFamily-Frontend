import { Stack, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { notifySuccess } from '@/shared/utils/notify';
import { gruposApi } from '../api';
import { GrupoForm } from '../components/GrupoForm';

export function NuevoGrupoPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <Stack>
      <Title order={1}>Crear grupo</Title>
      <GrupoForm
        userId={user.id}
        onCancel={() => navigate('/grupos')}
        onSave={async (nombre) => {
          const { data, msg } = await gruposApi.create({
            nombre,
            administradorId: user.id,
            miembros: [user.id],
          });
          notifySuccess(msg);
          navigate(`/grupos/${data.id}`, { replace: true });
        }}
      />
    </Stack>
  );
}
