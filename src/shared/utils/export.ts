import dayjs from 'dayjs';
import type { Column } from '@/shared/components/DataTable/types';

export type ExportFormat = 'pdf' | 'xlsx';
export type ExportCell = string | number;

const COLUMNAS_PARA_HORIZONTAL = 5;

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
