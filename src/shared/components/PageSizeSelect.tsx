import { Select } from '@mantine/core';

export type PageSizeSelectProps = {
  value: number;
  onChange: (limit: number) => void;
  options?: number[];
};

const OPCIONES_POR_DEFECTO = [10, 20, 50];

export function PageSizeSelect({
  value,
  onChange,
  options = OPCIONES_POR_DEFECTO,
}: PageSizeSelectProps) {
  return (
    <Select
      label="Por página"
      size="xs"
      w={90}
      data={options.map(String)}
      value={String(value)}
      onChange={(v) => {
        if (v) onChange(Number(v));
      }}
      allowDeselect={false}
    />
  );
}
