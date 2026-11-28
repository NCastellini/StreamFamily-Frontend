import dayjs from 'dayjs';
import { ESTADOS, FRECUENCIAS, TIPOS_MEDIO_PAGO } from './types';
import type { EstadoSuscripcion, Frecuencia, Moneda, TipoMedioPago } from './types';

export function formatCosto(costo: number, moneda: Moneda): string {
  return `${moneda} ${costo.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatFecha(fecha: string): string {
  return dayjs(fecha).format('DD/MM/YYYY');
}

export const labelFrecuencia = (f: Frecuencia) =>
  FRECUENCIAS.find((x) => x.value === f)?.label ?? f;

export const labelEstado = (e: EstadoSuscripcion) => ESTADOS.find((x) => x.value === e)?.label ?? e;

export const colorEstado = (e: EstadoSuscripcion) =>
  ESTADOS.find((x) => x.value === e)?.color ?? 'gray';

export const labelTipoMedioPago = (t: TipoMedioPago) =>
  TIPOS_MEDIO_PAGO.find((x) => x.value === t)?.label ?? t;
