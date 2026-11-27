/** Roles del back (`role` en el token). */
export type Rol = 'admin' | 'cliente';

export type NavItem = {
  label: string;
  path: string;
  /** Roles que ven el ítem en el menú */
  roles: readonly Rol[];
};

/**
 * Menú lateral. El admin solo ve admin/* y perfil; el cliente ve el resto.
 * El back valida los permisos por su cuenta: esto solo ordena la navegación.
 */
export const navigation: readonly NavItem[] = [
  { label: 'Inicio', path: '/', roles: ['cliente'] },
  { label: 'Suscripciones', path: '/suscripciones', roles: ['cliente'] },
  { label: 'Medios de pago', path: '/suscripciones/medios-pago', roles: ['cliente'] },
  { label: 'Grupos familiares', path: '/grupos', roles: ['cliente'] },
  { label: 'Historial de pagos', path: '/pagos', roles: ['cliente'] },
  { label: 'Alertas', path: '/alertas', roles: ['cliente'] },
  { label: 'Métricas', path: '/admin/metricas', roles: ['admin'] },
  { label: 'Usuarios', path: '/admin/usuarios', roles: ['admin'] },
  { label: 'Categorías', path: '/admin/categorias', roles: ['admin'] },
  { label: 'Perfil', path: '/perfil', roles: ['admin', 'cliente'] },
];

/** Ítems visibles para un rol. Sin sesión (null) se muestran todos. */
export function itemsParaRol(rol: Rol | null): NavItem[] {
  return navigation.filter((item) => rol === null || item.roles.includes(rol));
}

/** Indica si una ruta del menú corresponde a la URL actual. */
export function esRutaActiva(itemPath: string, pathname: string): boolean {
  if (itemPath === '/') return pathname === '/';
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}
