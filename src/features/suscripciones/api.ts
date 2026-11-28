import { http } from '@/shared/api/httpClient';
import type { ListParams } from '@/shared/types/list.types';
import type {
  Categoria,
  EstadoSuscripcion,
  MedioPago,
  MedioPagoInput,
  Suscripcion,
  SuscripcionInput,
} from './types';

export const suscripcionesApi = {
  list: (params: ListParams, signal?: AbortSignal) =>
    http.get<Suscripcion[]>('/suscripciones', params, { signal }),
  getById: (id: number, signal?: AbortSignal) =>
    http.get<Suscripcion>(`/suscripciones/${id}`, undefined, { signal }),
  create: (input: SuscripcionInput) => http.post<Suscripcion>('/suscripciones', input),
  update: (id: number, input: Partial<SuscripcionInput>) =>
    http.patch<Suscripcion>(`/suscripciones/${id}`, input),
  cambiarEstado: (id: number, estado: EstadoSuscripcion) =>
    http.patch<Suscripcion>(`/suscripciones/${id}/estado`, { estado }),
  remove: (id: number) => http.delete<Suscripcion>(`/suscripciones/${id}`),
};

export const mediosPagoApi = {
  list: (params: ListParams, signal?: AbortSignal) =>
    http.get<MedioPago[]>('/medios-pago', params, { signal }),
  create: (input: MedioPagoInput) => http.post<MedioPago>('/medios-pago', input),
  update: (id: number, input: Partial<MedioPagoInput>) =>
    http.patch<MedioPago>(`/medios-pago/${id}`, input),
  remove: (id: number) => http.delete<MedioPago>(`/medios-pago/${id}`),
};

/** Categorías para los selects. Cuando Román tenga su api.ts, se puede usar la suya. */
export const categoriasApi = {
  list: (signal?: AbortSignal) =>
    http.get<Categoria[]>(
      '/categorias',
      { limit: 100, sortBy: 'nombre', order: 'asc' },
      { signal },
    ),
};
