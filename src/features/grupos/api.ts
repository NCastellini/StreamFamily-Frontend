import { http } from '@/shared/api/httpClient';
import type { ListParams } from '@/shared/types/list.types';
import type { Grupo, GrupoInput, ResumenGrupo } from './types';

export const gruposApi = {
  list: (params: ListParams, signal?: AbortSignal) =>
    http.get<Grupo[]>('/grupos', params, { signal }),
  getById: (id: number, signal?: AbortSignal) =>
    http.get<Grupo>(`/grupos/${id}`, undefined, { signal }),
  resumen: (id: number, signal?: AbortSignal) =>
    http.get<ResumenGrupo>(`/grupos/${id}/resumen`, undefined, { signal }),
  create: (input: GrupoInput) => http.post<Grupo>('/grupos', input),
  update: (id: number, input: Partial<GrupoInput>) => http.patch<Grupo>(`/grupos/${id}`, input),
  remove: (id: number) => http.delete<Grupo>(`/grupos/${id}`),
  addMember: (id: number, usuarioId: number) =>
    http.post<Grupo>(`/grupos/${id}/miembros`, { usuarioId }),
  removeMember: (id: number, usuarioId: number) =>
    http.delete<Grupo>(`/grupos/${id}/miembros/${usuarioId}`),
};

export async function listarParaExportar(params: ListParams) {
  const limit = 100;
  const primera = await gruposApi.list({ ...params, page: 1, limit });
  const data = [...primera.data];
  for (let page = 2; page <= (primera.meta?.totalPages ?? 1); page++) {
    const siguiente = await gruposApi.list({ ...params, page, limit });
    data.push(...siguiente.data);
  }
  return { msg: primera.msg, code: primera.code, data };
}
