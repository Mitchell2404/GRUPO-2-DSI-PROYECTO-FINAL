import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { RolUsuario } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: RolUsuario[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, usuario } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && usuario && !allowedRoles.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}