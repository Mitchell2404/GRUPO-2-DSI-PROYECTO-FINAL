import { useState, useEffect } from 'react';
import { servicioService } from '../services/servicioService';
import { categoriaService } from '../services/categoriaService';
import { solicitudService } from '../services/solicitudService';
import { useAuth } from '../context/AuthContext';
import type { Servicio, CategoriaServicio } from '../types';
import { RolUsuario } from '../types';

export default function ServiciosPage() {
  const { usuario } = useAuth();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<CategoriaServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [solicitando, setSolicitando] = useState<number | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [serviciosData, categoriasData] = await Promise.all([
        servicioService.getActivos(),
        categoriaService.getAll()
      ]);
      setServicios(serviciosData);
      setCategorias(categoriasData);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtrarServicios = () => {
    let resultado = servicios;

    if (categoriaFiltro) {
      resultado = resultado.filter(s => s.categoria.id === categoriaFiltro);
    }

    if (busqueda) {
      resultado = resultado.filter(s =>
        s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        s.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    return resultado;
  };

  const handleSolicitar = async (servicioId: number) => {
    if (!usuario?.id) {
      alert('Debes iniciar sesión para solicitar servicios');
      return;
    }

    if (usuario.rol !== RolUsuario.CLIENTE) {
      alert('Solo los estudiantes pueden solicitar servicios');
      return;
    }

    try {
      setSolicitando(servicioId);
      await solicitudService.create({
        usuarioId: usuario.id,
        servicioId: servicioId
      });
      alert('✅ Solicitud creada exitosamente. Puedes ver su estado en "Mis Solicitudes"');
    } catch (err) {
      alert('❌ Error al crear la solicitud. Intenta de nuevo.');
      console.error(err);
    } finally {
      setSolicitando(null);
    }
  };

  if (loading) return <div className="loading">⏳ Cargando servicios...</div>;
  if (error) return <div className="error">{error}</div>;

  const serviciosFiltrados = filtrarServicios();

  return (
    <div className="container">
      <div className="card">
        <h2>🏠 Catálogo de Servicios</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '24px' }}>
          Explora todos los servicios disponibles de la universidad
        </p>
        
        {/* Filtros */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '250px', marginBottom: 0 }}>
            <label>🔍 Buscar</label>
            <input
              type="text"
              placeholder="Buscar servicio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: '250px', marginBottom: 0 }}>
            <label>📂 Categoría</label>
            <select
              value={categoriaFiltro || ''}
              onChange={(e) => setCategoriaFiltro(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid de servicios */}
        <div className="grid">
          {serviciosFiltrados.map(servicio => (
            <div key={servicio.id} className="card" style={{ marginBottom: 0 }}>
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ 
                  marginBottom: '8px', 
                  background: 'var(--gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '20px'
                }}>
                  {servicio.nombre}
                </h3>
                <span className="badge badge-info">{servicio.categoria.nombre}</span>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px', lineHeight: '1.6' }}>
                {servicio.descripcion}
              </p>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: 'auto',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)'
              }}>
                <strong style={{ fontSize: '24px', color: 'var(--success)' }}>
                  S/ {servicio.precio.toFixed(2)}
                </strong>
                
                {usuario?.rol === RolUsuario.CLIENTE && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleSolicitar(servicio.id!)}
                    disabled={solicitando === servicio.id}
                  >
                    {solicitando === servicio.id ? '⏳ Solicitando...' : '📝 Solicitar'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {serviciosFiltrados.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No se encontraron servicios</h3>
            <p>Intenta con otros filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}