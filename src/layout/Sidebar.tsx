import { NavLink, Stack } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { esRutaActiva, itemsParaRol, type Rol } from '@/layout/navigation';

type SidebarProps = {
  /** Se llama al elegir un ítem (en mobile cierra el menú) */
  onNavigate: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const { pathname } = useLocation();
  // TODO (Nazareno): tomar el rol de la sesión, por ejemplo useAuth().user?.role
  const rol: Rol | null = null;
  const items = itemsParaRol(rol);

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
