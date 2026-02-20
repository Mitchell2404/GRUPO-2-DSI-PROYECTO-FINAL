import { useState, useEffect } from 'react';
import { solicitudService } from '../services/solicitudService';
import { useAuth } from '../context/AuthContext';
import type { SolicitudServicio } from '../types';
import './MisSolicitudesPage.css';

export default function MisSolicitudesPage() {
  const { usuario } = useAuth();
  const [solicitudes, setSolicitudes] = useState<SolicitudServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');

  useEffect(() => {
    if (usuario?.id) {
      cargarSolicitudes();
    }
  }, [usuario]);

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await solicitudService.getByUsuario(usuario!.id!);
      setSolicitudes(data);
    } catch (err) {
      setError('Error al cargar las solicitudes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtrarSolicitudes = () => {
    if (filtroEstado === 'TODOS') {
      return solicitudes;
    }
    return solicitudes.filter(s => s.estado === filtroEstado);
  };

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, string> = {
      PENDIENTE: 'badge-warning',
      APROBADO: 'badge-success',
      RECHAZADO: 'badge-danger'
    };
    return badges[estado] || 'badge-info';
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">⏳ Cargando solicitudes...</div>;
  if (error) return <div className="error">{error}</div>;

  const solicitudesFiltradas = filtrarSolicitudes();

  return (
    <div className="container">
      <div className="card">
        <div className="page-header">
          <div>
            <h2>📋 Mis Solicitudes</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Historial completo de tus solicitudes de servicios
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters">
          <button
            className={`filter-btn ${filtroEstado === 'TODOS' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('TODOS')}
          >
            Todas ({solicitudes.length})
          </button>
          <button
            className={`filter-btn ${filtroEstado === 'PENDIENTE' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('PENDIENTE')}
          >
            Pendientes ({solicitudes.filter(s => s.estado === 'PENDIENTE').length})
          </button>
          <button
            className={`filter-btn ${filtroEstado === 'APROBADO' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('APROBADO')}
          >
            Aprobadas ({solicitudes.filter(s => s.estado === 'APROBADO').length})
          </button>
          <button
            className={`filter-btn ${filtroEstado === 'RECHAZADO' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('RECHAZADO')}
          >
            Rechazadas ({solicitudes.filter(s => s.estado === 'RECHAZADO').length})
          </button>
        </div>

        {/* Lista de solicitudes */}
        {solicitudesFiltradas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No hay solicitudes</h3>
            <p>Aún no has realizado ninguna solicitud de servicio</p>
          </div>
        ) : (
          <div className="solicitudes-list">
            {solicitudesFiltradas.map(solicitud => (
              <div key={solicitud.id} className="solicitud-card">
                <div className="solicitud-header">
                  <div>
                    <h3>{solicitud.servicio.nombre}</h3>
                    <p className="solicitud-categoria">
                      {solicitud.servicio.categoria.nombre}
                    </p>
                  </div>
                  <span className={`badge ${getEstadoBadge(solicitud.estado)}`}>
                    {solicitud.estado}
                  </span>
                </div>

                <div className="solicitud-body">
                  <p>{solicitud.servicio.descripcion}</p>
                  
                  <div className="solicitud-info">
                    <div className="info-item">
                      <span className="info-label">💰 Costo:</span>
                      <span className="info-value">S/ {solicitud.servicio.precio.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📅 Fecha de solicitud:</span>
                      <span className="info-value">{formatearFecha(solicitud.fechaSolicitud!)}</span>
                    </div>
                    {solicitud.fechaRespuesta && (
                      <div className="info-item">
                        <span className="info-label">✅ Fecha de respuesta:</span>
                        <span className="info-value">{formatearFecha(solicitud.fechaRespuesta)}</span>
                      </div>
                    )}
                  </div>

                  {solicitud.observaciones && (
                    <div className="observaciones">
                      <strong>📝 Observaciones:</strong>
                      <p>{solicitud.observaciones}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}