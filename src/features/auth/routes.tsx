import type { RouteObject } from 'react-router-dom';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export const authRoutes: RouteObject[] = [
  { path: 'login', element: <LoginPage /> },
  { path: 'registro', element: <RegisterPage /> },
  { path: 'recuperar', element: <ForgotPasswordPage /> },
];
