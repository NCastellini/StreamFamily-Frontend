export type Moneda = 'ARS' | 'USD';
export type Frecuencia = 'mensual' | 'trimestral' | 'anual';
export type EstadoSuscripcion = 'activa' | 'pausada' | 'cancelada';
export type TipoMedioPago = 'tarjeta_credito' | 'tarjeta_debito' | 'billetera' | 'transferencia';

export interface Suscripcion {
  id: number;
  plataforma: string;
  plan: string;
  costo: number;
  moneda: Moneda;
  frecuencia: Frecuencia;
  fechaCobro: string;
  medioPagoId: number;
  categoriaId: number;
  grupoId: number | null;
  usuarioId: number;
  estado: EstadoSuscripcion;
  creadaEn: string;
}

export type SuscripcionInput = Omit<Suscripcion, 'id' | 'creadaEn' | 'estado'>;

export type SuscripcionFilters = {
  estado?: string;
  moneda?: string;
  frecuencia?: string;
  categoriaId?: string;
};

export interface MedioPago {
  id: number;
  nombre: string;
  tipo: TipoMedioPago;
  ultimosDigitos: string | null;
}

export type MedioPagoInput = Pick<MedioPago, 'nombre' | 'tipo'>;

export interface Categoria {
  id: number;
  nombre: string;
}

export const MONEDAS: Moneda[] = ['ARS', 'USD'];

export const FRECUENCIAS: { value: Frecuencia; label: string }[] = [
  { value: 'mensual', label: 'Mensual' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'anual', label: 'Anual' },
];

export const ESTADOS: { value: EstadoSuscripcion; label: string; color: string }[] = [
  { value: 'activa', label: 'Activa', color: 'green' },
  { value: 'pausada', label: 'Pausada', color: 'yellow' },
  { value: 'cancelada', label: 'Cancelada', color: 'gray' },
];

export const TIPOS_MEDIO_PAGO: { value: TipoMedioPago; label: string }[] = [
  { value: 'tarjeta_credito', label: 'Tarjeta de crédito' },
  { value: 'tarjeta_debito', label: 'Tarjeta de débito' },
  { value: 'billetera', label: 'Billetera virtual' },
  { value: 'transferencia', label: 'Transferencia' },
];
