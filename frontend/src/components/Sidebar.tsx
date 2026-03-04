import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RolUsuario } from '../types';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { usuario, logout } = useAuth();
  const location = useLocation();

  if (!usuario) return null;

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const getNavLinks = () => {
    if (usuario.rol === RolUsuario.CLIENTE) {
      return [
        { path: '/', label: '🏠 Catálogo de Servicios', icon: '🏠' },
        { path: '/mis-solicitudes', label: '📋 Mis Solicitudes', icon: '📋' }
      ];
    }

    if (usuario.rol === RolUsuario.ADMIN) {
      return [
        { path: '/', label: '🏠 Catálogo de Servicios', icon: '🏠' },
        { path: '/gestion-solicitudes', label: '✅ Gestión de Solicitudes', icon: '✅' },
        { path: '/reportes', label: '📊 Reportes', icon: '📊' }
      ];
    }

    if (usuario.rol === RolUsuario.SOPORTE) {
      return [
        { path: '/', label: '🏠 Catálogo de Servicios', icon: '🏠' },
        { path: '/gestion-solicitudes', label: '✅ Gestión de Solicitudes', icon: '✅' },
        { path: '/reportes', label: '📊 Reportes', icon: '📊' },
        { path: '/usuarios', label: '👥 Gestión de Usuarios', icon: '👥' },
        { path: '/admin', label: '⚙️ Administración', icon: '⚙️' }
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  const getRoleBadge = () => {
    const badges: Record<string, { text: string; class: string }> = {
      ADMIN: { text: 'Administrativo', class: 'badge-warning' },
      SOPORTE: { text: 'Soporte', class: 'badge-danger' },
      CLIENTE: { text: 'Estudiante', class: 'badge-info' }
    };
    return badges[usuario.rol] || badges.CLIENTE;
  };

  const roleBadge = getRoleBadge();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* User Info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {usuario.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h3>{usuario.nombre}</h3>
            <span className={`badge ${roleBadge.class}`}>{roleBadge.text}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${isActive(link.path)}`}
              onClick={onClose}
            >
              <span className="link-icon">{link.icon}</span>
              <span className="link-text">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn btn-danger btn-block">
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}