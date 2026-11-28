import { useState } from 'react';
import { CloseButton, TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useLocation } from 'react-router-dom';

export type SearchBarProps = {
  value: string;
  onChange: (q: string) => void;
  placeholder?: string;
  debounceMs?: number;
};

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar…',
  debounceMs = 400,
}: SearchBarProps) {
  const [texto, setTexto] = useState(value);
  const [valorPrevio, setValorPrevio] = useState(value);
  const avisarCambio = useDebouncedCallback(onChange, debounceMs);
  const { key: claveUbicacion } = useLocation();
  const [ubicacionPrevia, setUbicacionPrevia] = useState(claveUbicacion);

  // Sincroniza si value cambia desde afuera, sin pisar lo que se está tipeando
  // (el padre recibe el texto sin espacios al final).
  if (value !== valorPrevio) {
    setValorPrevio(value);
    if (value !== texto.trim()) {
      avisarCambio.cancel();
      setTexto(value);
    }
  }

  // Navegación externa (p. ej. reset) con el debounce pendiente: se descarta lo tipeado.
  // El propio debounce ya no está pendiente cuando cambia la URL.
  if (claveUbicacion !== ubicacionPrevia) {
    setUbicacionPrevia(claveUbicacion);
    if (avisarCambio.isPending()) {
      avisarCambio.cancel();
      setTexto(value);
    }
  }

  const limpiar = () => {
    avisarCambio.cancel();
    setTexto('');
    onChange('');
  };

  return (
    <TextInput
      value={texto}
      onChange={(e) => {
        setTexto(e.currentTarget.value);
        avisarCambio(e.currentTarget.value);
      }}
      placeholder={placeholder}
      aria-label={placeholder}
      rightSection={texto ? <CloseButton size="sm" aria-label="Limpiar" onClick={limpiar} /> : null}
    />
  );
}
