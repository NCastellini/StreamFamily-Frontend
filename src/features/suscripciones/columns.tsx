import { Badge, Text } from '@mantine/core';
import type { Column } from '@/shared/components';
import { colorEstado, formatCosto, formatFecha, labelEstado, labelFrecuencia } from './format';
import type { Categoria, Suscripcion } from './types';

export function suscripcionColumns(categorias: Categoria[]): Column<Suscripcion>[] {
  const nombreCategoria = (id: number) => categorias.find((c) => c.id === id)?.nombre ?? `#${id}`;

  return [
    { key: 'plataforma', header: 'Plataforma', sortable: true, value: (s) => s.plataforma },
    { key: 'plan', header: 'Plan', sortable: true, value: (s) => s.plan },
    {
      key: 'costo',
      header: 'Costo',
      sortable: true,
      align: 'right',
      value: (s) => formatCosto(s.costo, s.moneda),
      render: (s) => (
        <Text span size="sm" style={{ whiteSpace: 'nowrap' }}>
          {formatCosto(s.costo, s.moneda)}
        </Text>
      ),
    },
    {
      key: 'frecuencia',
      header: 'Frecuencia',
      sortable: true,
      value: (s) => labelFrecuencia(s.frecuencia),
    },
    { key: 'categoriaId', header: 'Categoría', value: (s) => nombreCategoria(s.categoriaId) },
    {
      key: 'fechaCobro',
      header: 'Fecha de cobro',
      sortable: true,
      value: (s) => formatFecha(s.fechaCobro),
    },
    {
      key: 'estado',
      header: 'Estado',
      sortable: true,
      value: (s) => labelEstado(s.estado),
      render: (s) => (
        <Badge color={colorEstado(s.estado)} variant="light">
          {labelEstado(s.estado)}
        </Badge>
      ),
    },
  ];
}
