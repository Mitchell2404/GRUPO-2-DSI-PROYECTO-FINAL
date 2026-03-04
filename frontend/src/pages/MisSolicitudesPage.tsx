import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { solicitudService } from '../services/solicitudService';
import { servicioService } from '../services/servicioService';
import { useAuth } from '../context/AuthContext';
import type { SolicitudServicio, Servicio } from '../types';
import './MisSolicitudesPage.css';

export default function MisSolicitudesPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState<SolicitudServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');

  // Modal state
  const [modalAbierto, setModalAbierto] = useState(false);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<number | null>(null);
  const [loadingServicios, setLoadingServicios] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

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

  const abrirModal = async () => {
    setModalAbierto(true);
    setServicioSeleccionado(null);
    setErrorModal(null);
    try {
      setLoadingServicios(true);
      const data = await servicioService.getActivos();
      setServicios(data);
    } catch (err) {
      setErrorModal('Error al cargar los servicios disponibles');
      console.error(err);
    } finally {
      setLoadingServicios(false);
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setServicioSeleccionado(null);
    setErrorModal(null);
  };

  const enviarSolicitud = async () => {
    if (!servicioSeleccionado) {
      setErrorModal('Por favor selecciona un servicio');
      return;
    }
    try {
      setEnviando(true);
      const nueva = await solicitudService.create({
        usuarioId: usuario!.id!,
        servicioId: servicioSeleccionado,
      });
      setSolicitudes(prev => [nueva, ...prev]);
      cerrarModal();
    } catch (err) {
      setErrorModal('Error al enviar la solicitud. Intenta nuevamente.');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const filtrarSolicitudes = () => {
    if (filtroEstado === 'TODOS') return solicitudes;
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

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

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
          <button className="btn btn-primary" onClick={abrirModal}>
            ➕ Nueva Solicitud
          </button>
        </div>

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

        {solicitudesFiltradas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>
              {filtroEstado === 'TODOS'
                ? 'Aún no has realizado solicitudes'
                : 'No tienes solicitudes con ese estado'}
            </h3>
            <p>
              {filtroEstado === 'TODOS'
                ? 'Haz clic en "Nueva Solicitud" para comenzar'
                : 'Prueba con otro filtro'}
            </p>
            {filtroEstado === 'TODOS' && (
              <button
                className="btn btn-primary"
                onClick={abrirModal}
                style={{ marginTop: '16px' }}
              >
                ➕ Nueva Solicitud
              </button>
            )}
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
                      <span className="info-value">
                        S/ {solicitud.servicio.precio.toFixed(2)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📅 Fecha de solicitud:</span>
                      <span className="info-value">
                        {formatearFecha(solicitud.fechaSolicitud!)}
                      </span>
                    </div>
                    {solicitud.fechaRespuesta && (
                      <div className="info-item">
                        <span className="info-label">✅ Fecha de respuesta:</span>
                        <span className="info-value">
                          {formatearFecha(solicitud.fechaRespuesta)}
                        </span>
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

      {/* Modal Nueva Solicitud */}
      {modalAbierto && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '16px'
          }}
          onClick={cerrarModal}
        >
          <div
            style={{
              background: '#fff', borderRadius: '12px', padding: '28px',
              width: '100%', maxWidth: '520px', maxHeight: '80vh',
              overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>➕ Nueva Solicitud</h3>
              <button
                onClick={cerrarModal}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#999' }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Selecciona el servicio que deseas solicitar:
            </p>

            {loadingServicios ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
                ⏳ Cargando servicios...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {servicios.map(servicio => (
                  <div
                    key={servicio.id}
                    onClick={() => setServicioSeleccionado(servicio.id!)}
                    style={{
                      padding: '14px 16px', borderRadius: '8px', cursor: 'pointer',
                      border: servicioSeleccionado === servicio.id
                        ? '2px solid var(--primary, #3B82F6)'
                        : '2px solid #E5E7EB',
                      background: servicioSeleccionado === servicio.id ? '#EFF6FF' : '#fff',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>{servicio.nombre}</p>
                        <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                          {servicio.categoria?.nombre}
                        </p>
                        <p style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>
                          {servicio.descripcion}
                        </p>
                      </div>
                      <span style={{
                        marginLeft: '12px', whiteSpace: 'nowrap', fontWeight: 700,
                        fontSize: '14px', color: '#059669'
                      }}>
                        S/ {servicio.precio?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errorModal && (
              <p style={{ color: '#DC2626', fontSize: '13px', marginBottom: '14px' }}>
                ⚠️ {errorModal}
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="btn"
                onClick={cerrarModal}
                style={{ background: '#F3F4F6', color: '#374151' }}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={enviarSolicitud}
                disabled={enviando || !servicioSeleccionado}
              >
                {enviando ? '⏳ Enviando...' : '✅ Enviar Solicitud'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}