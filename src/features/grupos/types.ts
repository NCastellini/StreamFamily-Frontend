export interface Grupo {
  id: number;
  nombre: string;
  administradorId: number;
  miembros: number[];
  creadoEn: string;
}
export type GrupoInput = Pick<Grupo, 'nombre' | 'administradorId' | 'miembros'>;
export interface ResumenGrupo {
  grupoId: number;
  nombre: string;
  cantidadMiembros: number;
  suscripcionesActivas: number;
  subtotalMensual: Record<'ARS' | 'USD', number>;
}
