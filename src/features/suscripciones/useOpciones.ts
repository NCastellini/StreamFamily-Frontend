import { useEffect, useState } from 'react';
import { gruposApi } from '@/features/grupos/api';
import type { Grupo } from '@/features/grupos/types';
import { notifyError } from '@/shared/utils/notify';
import { categoriasApi, mediosPagoApi } from './api';
import type { Categoria, MedioPago } from './types';

type Opciones = {
  categorias: Categoria[];
  mediosPago: MedioPago[];
  grupos: Grupo[];
  cargando: boolean;
};

/** Categorías, medios de pago y grupos del usuario para los selects y las etiquetas. */
export function useOpciones(): Opciones {
  const [opciones, setOpciones] = useState<Opciones>({
    categorias: [],
    mediosPago: [],
    grupos: [],
    cargando: true,
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    Promise.all([
      categoriasApi.list(signal),
      mediosPagoApi.list({ limit: 100, sortBy: 'nombre', order: 'asc' }, signal),
      gruposApi.list({ limit: 100, sortBy: 'nombre', order: 'asc' }, signal),
    ]).then(
      ([categorias, mediosPago, grupos]) => {
        setOpciones({
          categorias: categorias.data,
          mediosPago: mediosPago.data,
          grupos: grupos.data,
          cargando: false,
        });
      },
      (error: unknown) => {
        if (signal.aborted) return;
        notifyError(error, 'No se pudieron cargar las opciones');
        setOpciones((previo) => ({ ...previo, cargando: false }));
      },
    );
    return () => controller.abort();
  }, []);

  return opciones;
}
