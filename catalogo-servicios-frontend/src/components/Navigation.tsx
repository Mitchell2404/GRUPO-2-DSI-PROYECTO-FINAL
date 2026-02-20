import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RolUsuario } from '../types';
import './Navigation.css';

export default function Navigation() {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) return null;

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  // Función para determinar qué enlaces mostrar según el rol
  const getNavLinks = () => {
    if (usuario.rol === RolUsuario.CLIENTE) {
      // CLIENTE (Estudiante): Solo ver y solicitar servicios
      return [
        { path: '/', label: 'Catálogo de Servicios' },
        { path: '/mis-solicitudes', label: 'Mis Solicitudes' }
      ];
    }

    if (usuario.rol === RolUsuario.ADMIN) {
      // ADMIN (Administrativo): Gestión de solicitudes y reportes
      return [
        { path: '/', label: 'Catálogo de Servicios' },
        { path: '/gestion-solicitudes', label: 'Gestión de Solicitudes' },
        { path: '/reportes', label: 'Reportes' }
      ];
    }

    if (usuario.rol === RolUsuario.SOPORTE) {
      // SOPORTE: Todas las opciones incluido gestión de usuarios
      return [
        { path: '/', label: 'Catálogo de Servicios' },
        { path: '/gestion-solicitudes', label: 'Gestión de Solicitudes' },
        { path: '/reportes', label: 'Reportes' },
        { path: '/usuarios', label: 'Gestión de Usuarios' },
        { path: '/admin', label: 'Administración' }
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="nav">
      <ul>
        {navLinks.map(link => (
          <li key={link.path}>
            <Link to={link.path} className={isActive(link.path)}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}