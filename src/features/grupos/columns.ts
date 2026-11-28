import type { Column } from '@/shared/components';
import type { Grupo } from './types';

export const grupoColumns: Column<Grupo>[] = [
  { key: 'id', header: 'ID', sortable: true, value: (g) => g.id },
  { key: 'nombre', header: 'Nombre', sortable: true, value: (g) => g.nombre },
  {
    key: 'administradorId',
    header: 'ID del administrador',
    sortable: true,
    value: (g) => g.administradorId,
  },
  { key: 'miembros', header: 'Miembros', value: (g) => g.miembros.length },
];
