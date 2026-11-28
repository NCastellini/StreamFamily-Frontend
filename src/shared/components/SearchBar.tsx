import { useState } from 'react';
import { CloseButton, TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';

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

  // Sincroniza si value cambia desde afuera, sin pisar lo que se está tipeando
  // (el padre recibe el texto sin espacios al final).
  if (value !== valorPrevio) {
    setValorPrevio(value);
    if (value !== texto.trim()) {
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
