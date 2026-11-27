import { Avatar, Menu, UnstyledButton } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';

export function UserMenu() {
  const navigate = useNavigate();
  // TODO (Nazareno): mostrar el nombre del usuario de la sesión y llamar a logout().
  const nombre = 'Mi cuenta';

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
        <Menu.Item color="red" onClick={() => navigate('/login')}>
          Cerrar sesión
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
