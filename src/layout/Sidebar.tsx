import { NavLink, Stack } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { esRutaActiva, itemsParaRol } from '@/layout/navigation';

type SidebarProps = {
  /** Se llama al elegir un ítem (en mobile cierra el menú) */
  onNavigate: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const { pathname } = useLocation();
  const { role } = useAuth();
  const items = itemsParaRol(role);

  // Si hay un ítem más específico activo (por ejemplo, medios de pago), no se marca también el padre.
  const activo = items
    .filter((item) => esRutaActiva(item.path, pathname))
    .sort((a, b) => b.path.length - a.path.length)[0]?.path;

  return (
    <Stack gap={4}>
      {items.map((item) => (
        <NavLink
          key={item.path}
          component={Link}
          to={item.path}
          label={item.label}
          active={item.path === activo}
          onClick={onNavigate}
        />
      ))}
    </Stack>
  );
}
