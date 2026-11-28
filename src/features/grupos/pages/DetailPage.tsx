import { useEffect, useState } from 'react';
import { Alert, Anchor, Button, Group, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { ConfirmDialog } from '@/shared/components';
import { notifySuccess } from '@/shared/utils/notify';
import { gruposApi } from '../api';
import { GrupoForm } from '../components/GrupoForm';
import type { Grupo, ResumenGrupo } from '../types';

export function GrupoDetailPage() {
  const { id } = useParams();
  return (
    <Stack>
      <Anchor component={Link} to="/grupos">
        Volver a grupos
      </Anchor>
      {id && /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0 ? (
        <Detalle key={id} id={Number(id)} />
      ) : (
        <Alert color="red">Grupo no encontrado</Alert>
      )}
    </Stack>
  );
}

function Detalle({ id }: { id: number }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [resumen, setResumen] = useState<ResumenGrupo | null>(null);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);
  const [editando, setEditando] = useState(false);
  const [confirmarBaja, setConfirmarBaja] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      gruposApi.getById(id, controller.signal),
      gruposApi.resumen(id, controller.signal),
    ]).then(
      ([detail, summary]) => {
        if (!controller.signal.aborted) {
          setGrupo(detail.data);
          setResumen(summary.data);
        }
      },
      (cause: unknown) => {
        if (!controller.signal.aborted)
          setError(cause instanceof Error ? cause.message : 'No se pudo cargar el grupo');
      },
    );
    return () => controller.abort();
  }, [id, intento]);
  if (error)
    return (
      <Alert color="red" title={error}>
        <Button
          variant="light"
          onClick={() => {
            setError('');
            setIntento((i) => i + 1);
          }}
        >
          Reintentar
        </Button>
      </Alert>
    );
  if (!grupo || !resumen || !user) return <Loader aria-label="Cargando grupo" />;
  const administra = grupo.administradorId === user.id;
  return (
    <Stack>
      <Title order={1}>{grupo.nombre}</Title>
      {editando && administra ? (
        <GrupoForm
          grupo={grupo}
          userId={user.id}
          onCancel={() => setEditando(false)}
          onSave={async (nombre, administradorId) => {
            const res = await gruposApi.update(id, { nombre, administradorId });
            setGrupo(res.data);
            setEditando(false);
            notifySuccess(res.msg);
          }}
        />
      ) : (
        <>
          <Text>Administrador: usuario #{grupo.administradorId}</Text>
          {administra && (
            <Group>
              <Button onClick={() => setEditando(true)}>Editar grupo</Button>
              <Button color="red" variant="light" onClick={() => setConfirmarBaja(true)}>
                Eliminar grupo
              </Button>
            </Group>
          )}
        </>
      )}
      <Paper withBorder p="md">
        <Stack gap="xs">
          <Title order={2} size="h3">
            Gasto mensual
          </Title>
          {(['ARS', 'USD'] as const).map((moneda) => (
            <Text key={moneda}>
              {moneda}{' '}
              {resumen.subtotalMensual[moneda].toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          ))}
          <Text>Suscripciones activas: {resumen.suscripcionesActivas}</Text>
        </Stack>
      </Paper>
      <ConfirmDialog
        opened={confirmarBaja}
        title="Eliminar grupo"
        message={`¿Eliminar «${grupo.nombre}»?`}
        onCancel={() => setConfirmarBaja(false)}
        onConfirm={async () => {
          const res = await gruposApi.remove(id);
          notifySuccess(res.msg);
          navigate('/grupos', { replace: true });
        }}
      />
    </Stack>
  );
}
