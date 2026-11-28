import { useState } from 'react';
import { Button, Menu } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { ApiResponse } from '@/shared/types/api.types';
import {
  buildExportTable,
  exportFileName,
  exportToPdf,
  exportToXlsx,
  fetchAllPages,
} from '@/shared/utils/export';
import type { ExportFormat } from '@/shared/utils/export';
import { notifyError } from '@/shared/utils/notify';
import type { Column } from './DataTable/types';

export type ExportButtonProps<T> = {
  entity: string;
  columns: Column<T>[];
  fetchPage: (p: { page: number; limit: number }) => Promise<ApiResponse<T[]>>;
  disabled?: boolean;
};

export function ExportButton<T>({ entity, columns, fetchPage, disabled }: ExportButtonProps<T>) {
  const [generando, setGenerando] = useState(false);

  const exportar = async (formato: ExportFormat) => {
    setGenerando(true);
    try {
      const registros = await fetchAllPages(fetchPage);
      if (registros.length === 0) {
        notifications.show({
          color: 'yellow',
          title: 'Sin datos',
          message: 'No hay datos para exportar',
        });
        return;
      }

      const { encabezados, filas } = buildExportTable(columns, registros);
      const nombre = exportFileName(entity, formato);

      if (formato === 'xlsx') await exportToXlsx(nombre, encabezados, filas);
      else await exportToPdf(nombre, encabezados, filas);
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
