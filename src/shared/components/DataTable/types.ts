import type { ReactNode } from 'react';

export type Column<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  value: (row: T) => string | number | null;
  render?: (row: T) => ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  exportable?: boolean;
};
