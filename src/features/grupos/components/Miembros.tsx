import { useState } from 'react';
import { Button, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '@/shared/components';
import { notifyError, notifySuccess } from '@/shared/utils/notify';
import { gruposApi } from '../api';
import { usuarioIdSchema } from '../schema';
import type { Grupo } from '../types';

export function Miembros({
  grupo,
  userId,
  onChange,
}: {
  grupo: Grupo;
  userId: number;
  onChange: (grupo: Grupo) => void;
}) {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [agregando, setAgregando] = useState(false);
  const [quitar, setQuitar] = useState<number | null>(null);
  const administra = grupo.administradorId === userId;
  const salir = quitar === userId;
  async function agregar() {
    const parsed = usuarioIdSchema.safeParse(id);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setAgregando(true);
    try {
      const res = await gruposApi.addMember(grupo.id, parsed.data);
      onChange(res.data);
      setId('');
      notifySuccess(res.msg);
    } catch (e) {
      notifyError(e);
    } finally {
      setAgregando(false);
    }
  }
  return (
    <Paper withBorder p="md">
      <Stack>
        <Title order={2} size="h3">
          Miembros ({grupo.miembros.length})
        </Title>
        {grupo.miembros.map((miembro) => (
          <Group key={miembro} justify="space-between">
            <Text>
              Usuario #{miembro}
              {miembro === userId ? ' (vos)' : ''}
            </Text>
            {administra && miembro !== userId && (
              <Button
                size="xs"
                variant="subtle"
                color="red"
                aria-label={`Quitar al usuario ${miembro}`}
                disabled={agregando}
                onClick={() => setQuitar(miembro)}
              >
                Quitar
              </Button>
            )}
          </Group>
        ))}
        {administra ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!agregando) void agregar();
            }}
          >
            <Group align="flex-end">
              <TextInput
                label="ID del usuario"
                inputMode="numeric"
                value={id}
                error={error}
                onChange={(e) => {
                  setId(e.currentTarget.value);
                  setError('');
                }}
              />
              <Button type="submit" loading={agregando}>
                Agregar miembro
              </Button>
            </Group>
          </form>
        ) : (
          <Button variant="light" color="red" onClick={() => setQuitar(userId)}>
            Salir del grupo
          </Button>
        )}
        <ConfirmDialog
          opened={quitar !== null}
          title={salir ? 'Salir del grupo' : 'Quitar miembro'}
          confirmLabel={salir ? 'Salir' : 'Quitar'}
          message={
            salir
              ? `¿Salir de «${grupo.nombre}»? Perderás acceso a su detalle.`
              : `¿Quitar al usuario #${quitar}?`
          }
          onCancel={() => setQuitar(null)}
          onConfirm={async () => {
            if (quitar === null) return;
            const res = await gruposApi.removeMember(grupo.id, quitar);
            notifySuccess(salir ? 'Saliste del grupo' : res.msg);
            setQuitar(null);
            if (salir) navigate('/grupos', { replace: true });
            else onChange(res.data);
          }}
        />
      </Stack>
    </Paper>
  );
}
