import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorPage } from '@/app/ErrorPage';

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * Atrapa errores que ocurren fuera del router (por ejemplo, en los providers)
 * para que la app nunca quede en blanco.
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error no controlado en la app', error, info.componentStack);
  }

  render() {
    return this.state.hasError ? <ErrorPage /> : this.props.children;
  }
}
