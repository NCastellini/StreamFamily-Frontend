import { useEffect, useState, type ReactNode } from 'react';
import {
  Alert,
  Anchor,
  Badge,
  Button,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { ConfirmDialog } from '@/shared/components';
import { useVolverAlListado } from '@/shared/hooks/useListadoOrigen';
import { notifyError, notifySuccess } from '@/shared/utils/notify';
import { suscripcionesApi } from '../api';
import { SuscripcionForm } from '../components/SuscripcionForm';
import { colorEstado, formatCosto, formatFecha, labelEstado, labelFrecuencia } from '../format';
import { ESTADOS } from '../types';
import type { EstadoSuscripcion, Suscripcion } from '../types';
import { useOpciones } from '../useOpciones';

export function SuscripcionDetailPage() {
  const { id } = useParams();
  const valido = id !== undefined && /^\d+$/.test(id) && Number(id) > 0;
  const volverA = useVolverAlListado('/suscripciones');

  return (
    <Stack>
      <Anchor component={Link} to={volverA}>
        Volver a suscripciones
      </Anchor>
      {valido ? (
        <Detalle key={id} id={Number(id)} />
      ) : (
        <Alert color="red">Suscripción no encontrada</Alert>
      )}
    </Stack>
  );
}

function Dato({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text>{children}</Text>
    </div>
  );
}

function Detalle({ id }: { id: number }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const volverA = useVolverAlListado('/suscripciones');
  const { categorias, mediosPago, grupos } = useOpciones();
  const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);
  const [editando, setEditando] = useState(false);
  const [confirmarBaja, setConfirmarBaja] = useState(false);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    suscripcionesApi.getById(id, controller.signal).then(
      (res) => {
        if (!controller.signal.aborted) setSuscripcion(res.data);
      },
      (cause: unknown) => {
        if (!controller.signal.aborted)
          setError(cause instanceof Error ? cause.message : 'No se pudo cargar la suscripción');
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
  if (!suscripcion || !user) return <Loader aria-label="Cargando suscripción" />;

  // Las del grupo que no son propias se pueden ver, pero solo las modifica su dueño.
  const esDueno = suscripcion.usuarioId === user.id;
  const nombre = <T extends { id: number; nombre: string }>(lista: T[], valor: number | null) =>
    valor === null ? 'Individual' : (lista.find((x) => x.id === valor)?.nombre ?? `#${valor}`);

  async function cambiarEstado(estado: EstadoSuscripcion) {
    setCambiandoEstado(true);
    try {
      const res = await suscripcionesApi.cambiarEstado(id, estado);
      setSuscripcion(res.data);
      notifySuccess(res.msg);
    } catch (e) {
      notifyError(e);
    } finally {
      setCambiandoEstado(false);
    }
  }

  return (
    <Stack>
      <Group gap="sm">
        <Title order={1}>
          {suscripcion.plataforma} · {suscripcion.plan}
        </Title>
        <Badge color={colorEstado(suscripcion.estado)} variant="light" size="lg">
          {labelEstado(suscripcion.estado)}
        </Badge>
      </Group>

      {editando && esDueno ? (
        <SuscripcionForm
          suscripcion={suscripcion}
          usuarioId={user.id}
          onCancel={() => setEditando(false)}
          onSave={async (input) => {
            const res = await suscripcionesApi.update(id, input);
            setSuscripcion(res.data);
            setEditando(false);
            notifySuccess(res.msg);
          }}
        />
      ) : (
        <>
          <Paper withBorder p="md">
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <Dato label="Costo">{formatCosto(suscripcion.costo, suscripcion.moneda)}</Dato>
              <Dato label="Frecuencia">{labelFrecuencia(suscripcion.frecuencia)}</Dato>
              <Dato label="Fecha de cobro">{formatFecha(suscripcion.fechaCobro)}</Dato>
              <Dato label="Medio de pago">{nombre(mediosPago, suscripcion.medioPagoId)}</Dato>
              <Dato label="Categoría">{nombre(categorias, suscripcion.categoriaId)}</Dato>
              <Dato label="Grupo familiar">{nombre(grupos, suscripcion.grupoId)}</Dato>
            </SimpleGrid>
          </Paper>

          {esDueno ? (
            <>
              <Stack gap={4}>
                <Text size="sm" fw={500}>
                  Estado
                </Text>
                <SegmentedControl
                  w="fit-content"
                  data={ESTADOS}
                  value={suscripcion.estado}
                  disabled={cambiandoEstado}
                  onChange={(v) => void cambiarEstado(v as EstadoSuscripcion)}
                />
              </Stack>
              <Group>
                <Button onClick={() => setEditando(true)}>Editar</Button>
                <Button color="red" variant="light" onClick={() => setConfirmarBaja(true)}>
                  Eliminar
                </Button>
              </Group>
            </>
          ) : (
            <Alert color="blue">
              Es una suscripción compartida en tu grupo: solo su dueño puede modificarla.
            </Alert>
          )}
        </>
      )}

      <ConfirmDialog
        opened={confirmarBaja}
        title="Eliminar suscripción"
        message={`¿Eliminar ${suscripcion.plataforma} (${suscripcion.plan})? Si tiene pagos o alertas, cancelala en lugar de eliminarla.`}
        onCancel={() => setConfirmarBaja(false)}
        onConfirm={async () => {
          const res = await suscripcionesApi.remove(id);
          notifySuccess(res.msg);
          navigate(volverA, { replace: true });
        }}
      />
    </Stack>
  );
}
