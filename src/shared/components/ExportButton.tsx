import { useState } from 'react';
import { Button, Menu } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import type { ApiResponse } from '@/shared/types/api.types';
import { notifyError } from '@/shared/utils/notify';
import type { Column } from './DataTable/types';

export type ExportButtonProps<T> = {
  entity: string;
  columns: Column<T>[];
  fetchPage: (p: { page: number; limit: number }) => Promise<ApiResponse<T[]>>;
  disabled?: boolean;
};

type Formato = 'pdf' | 'xlsx';

const LIMITE_EXPORT = 100;
const COLUMNAS_PARA_HORIZONTAL = 5;

async function descargarXlsx(nombre: string, encabezados: string[], filas: (string | number)[][]) {
  const XLSX = await import('xlsx');
  const hoja = XLSX.utils.aoa_to_sheet([encabezados, ...filas]);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Datos');
  XLSX.writeFile(libro, nombre);
}

async function descargarPdf(nombre: string, encabezados: string[], filas: (string | number)[][]) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const horizontal = encabezados.length > COLUMNAS_PARA_HORIZONTAL;
  const doc = new jsPDF({ orientation: horizontal ? 'landscape' : 'portrait' });
  autoTable(doc, { head: [encabezados], body: filas });
  doc.save(nombre);
}

export function ExportButton<T>({ entity, columns, fetchPage, disabled }: ExportButtonProps<T>) {
  const [generando, setGenerando] = useState(false);

  const exportar = async (formato: Formato) => {
    setGenerando(true);
    try {
      // TODO Etapa 1/2: paginar de a 100 hasta completar meta.total
      const res = await fetchPage({ page: 1, limit: LIMITE_EXPORT });
      const registros = res.data ?? [];
      if (registros.length === 0) {
        notifications.show({
          color: 'yellow',
          title: 'Sin datos',
          message: 'No hay datos para exportar',
        });
        return;
      }

      const exportables = columns.filter((c) => c.exportable !== false);
      const encabezados = exportables.map((c) => c.header);
      const filas = registros.map((row) => exportables.map((c) => c.value(row) ?? ''));
      const nombre = `${entity}_${dayjs().format('YYYY-MM-DD')}.${formato}`;

      if (formato === 'xlsx') await descargarXlsx(nombre, encabezados, filas);
      else await descargarPdf(nombre, encabezados, filas);
    } catch (e) {
      notifyError(e, 'No se pudo exportar');
    } finally {
      setGenerando(false);
    }
  };

  return (
    <Menu position="bottom-end" disabled={disabled || generando}>
      <Menu.Target>
        <Button variant="default" loading={generando} disabled={disabled}>
          Exportar
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => exportar('pdf')}>PDF</Menu.Item>
        <Menu.Item onClick={() => exportar('xlsx')}>XLSX</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
