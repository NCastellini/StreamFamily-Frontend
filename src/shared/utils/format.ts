import dayjs from 'dayjs';

export type Currency = 'ARS' | 'USD';

const FORMATO_FECHA = 'DD/MM/YYYY';
const FORMATO_FECHA_HORA = 'DD/MM/YYYY HH:mm';

const formateadoresMoneda = new Map<Currency, Intl.NumberFormat>();

function formateadorMoneda(currency: Currency): Intl.NumberFormat {
  let formateador = formateadoresMoneda.get(currency);
  if (!formateador) {
    formateador = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    formateadoresMoneda.set(currency, formateador);
  }
  return formateador;
}

function formatearFecha(value: string | Date | null | undefined, formato: string): string | null {
  if (value === null || value === undefined || value === '') return null;
  const fecha = dayjs(value);
  return fecha.isValid() ? fecha.format(formato) : null;
}

export function formatMoney(value: number | null | undefined, currency: Currency): string | null {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  return formateadorMoneda(currency).format(value);
}

export function formatDate(value: string | Date | null | undefined): string | null {
  return formatearFecha(value, FORMATO_FECHA);
}

export function formatDateTime(value: string | Date | null | undefined): string | null {
  return formatearFecha(value, FORMATO_FECHA_HORA);
}
