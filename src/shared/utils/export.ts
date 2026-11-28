import dayjs from 'dayjs';
import type { Column } from '@/shared/components/DataTable/types';
import type { ApiResponse, PaginationMeta } from '@/shared/types/api.types';

export type ExportFormat = 'pdf' | 'xlsx';
export type ExportCell = string | number;

const COLUMNAS_PARA_HORIZONTAL = 5;
const LIMITE_POR_PAGINA = 100;
const MAX_PAGINAS = 100;

function totalPaginasDe(meta: PaginationMeta, limit: number): number {
  if (Number.isInteger(meta.totalPages) && meta.totalPages >= 0) return meta.totalPages;
  if (!Number.isFinite(meta.total)) return 1;
  const tamanio = meta.limit > 0 ? meta.limit : limit;
  return Math.ceil(meta.total / tamanio);
}

export async function fetchAllPages<T>(
  fetchPage: (p: { page: number; limit: number }) => Promise<ApiResponse<T[]>>,
  limit = LIMITE_POR_PAGINA,
): Promise<T[]> {
  const primera = await fetchPage({ page: 1, limit });
  const registros = [...(primera.data ?? [])];
  if (!primera.meta || registros.length === 0) return registros;

  const ultima = Math.min(totalPaginasDe(primera.meta, limit), MAX_PAGINAS);
  for (let page = 2; page <= ultima; page++) {
    const res = await fetchPage({ page, limit });
    const datos = res.data ?? [];
    if (datos.length === 0) break;
    registros.push(...datos);
  }
  return registros;
}

export async function exportToXlsx(
  nombreArchivo: string,
  encabezados: string[],
  filas: ExportCell[][],
): Promise<void> {
  const XLSX = await import('xlsx');
  const hoja = XLSX.utils.aoa_to_sheet([encabezados, ...filas]);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Datos');
  XLSX.writeFile(libro, nombreArchivo);
}

export async function exportToPdf(
  nombreArchivo: string,
  encabezados: string[],
  filas: ExportCell[][],
): Promise<void> {
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const horizontal = encabezados.length > COLUMNAS_PARA_HORIZONTAL;
  const doc = new jsPDF({ orientation: horizontal ? 'landscape' : 'portrait' });
  autoTable(doc, { head: [encabezados], body: filas });
  doc.save(nombreArchivo);
}

export function buildExportTable<T>(
  columns: Column<T>[],
  rows: T[],
): { encabezados: string[]; filas: ExportCell[][] } {
  const exportables = columns.filter((c) => c.exportable !== false);
  return {
    encabezados: exportables.map((c) => c.header),
    filas: rows.map((row) => exportables.map((c) => c.value(row) ?? '')),
  };
}

export function exportFileName(entity: string, formato: ExportFormat): string {
  return `${entity}_${dayjs().format('YYYY-MM-DD')}.${formato}`;
}
