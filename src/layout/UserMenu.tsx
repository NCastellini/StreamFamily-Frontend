import { Avatar, Menu, UnstyledButton } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';

export function UserMenu() {
  const { user, logout } = useAuth();
  const nombre = user?.username ?? 'Mi cuenta';

  return (
    <Menu position="bottom-end" width={180}>
      <Menu.Target>
        <UnstyledButton aria-label="Menú de usuario">
          <Avatar color="violet" radius="xl">
            {nombre.charAt(0)}
          </Avatar>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{nombre}</Menu.Label>
        <Menu.Item component={Link} to="/perfil">
          Perfil
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" onClick={logout}>
          Cerrar sesión
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
