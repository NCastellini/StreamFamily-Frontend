import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '@/shared/types/api.types';
import { useAuth } from './useAuth';

function home(role: UserRole) {
  return role === 'admin' ? '/admin/metricas' : '/dashboard';
}

export function RequireAuth() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RequireRole({ role }: { role: UserRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === role ? <Outlet /> : <Navigate to={home(user.role)} replace />;
}

export function GuestOnly() {
  const { user } = useAuth();
  return user ? <Navigate to={home(user.role)} replace /> : <Outlet />;
}
