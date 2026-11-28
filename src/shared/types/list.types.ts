import type { SortOrder } from './api.types';

export type ListParams<F extends Record<string, string | undefined> = Record<never, never>> = {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: SortOrder;
  q?: string;
} & Partial<F>;
