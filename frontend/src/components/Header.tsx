import './Header.css';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <button onClick={onMenuClick} className="menu-button">
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className="header-title">
          <h1>Catálogo de Servicios UNMSM</h1>
          <p>Sistema de Gestión Universitaria</p>
        </div>
      </div>
    </header>
  );
}