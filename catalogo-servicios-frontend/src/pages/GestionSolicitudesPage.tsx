import { useState, useEffect } from 'react';
import { solicitudService } from '../services/solicitudService';
import type { SolicitudServicio } from '../types';
import { EstadoSolicitud } from '../types';

export default function GestionSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('PENDIENTE');
  const [procesando, setProcesando] = useState<number | null>(null);
  const [modalData, setModalData] = useState<{
    solicitudId: number;
    accion: 'aprobar' | 'rechazar';
    observaciones: string;
  } | null>(null);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await solicitudService.getAll();
      setSolicitudes(data);
    } catch (err) {
      setError('Error al cargar las solicitudes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (id: number, observaciones: string) => {
    try {
      setProcesando(id);
      await solicitudService.aprobar(id, observaciones);
      await cargarSolicitudes();
      setModalData(null);
      alert('✅ Solicitud aprobada exitosamente');
    } catch (err) {
      alert('❌ Error al aprobar la solicitud');
      console.error(err);
    } finally {
      setProcesando(null);
    }
  };

  const handleRechazar = async (id: number, observaciones: string) => {
    if (!observaciones.trim()) {
      alert('Debes proporcionar una razón para el rechazo');
      return;
    }

    try {
      setProcesando(id);
      await solicitudService.rechazar(id, observaciones);
      await cargarSolicitudes();
      setModalData(null);
      alert('❌ Solicitud rechazada');
    } catch (err) {
      alert('❌ Error al rechazar la solicitud');
      console.error(err);
    } finally {
      setProcesando(null);
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
            <h2>✅ Gestión de Solicitudes</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Aprobar o rechazar solicitudes de servicios
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters">
          <button
            className={`filter-btn ${filtroEstado === 'PENDIENTE' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('PENDIENTE')}
          >
            ⏳ Pendientes ({solicitudes.filter(s => s.estado === EstadoSolicitud.PENDIENTE).length})
          </button>
          <button
            className={`filter-btn ${filtroEstado === 'APROBADO' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('APROBADO')}
          >
            ✅ Aprobadas ({solicitudes.filter(s => s.estado === EstadoSolicitud.APROBADO).length})
          </button>
          <button
            className={`filter-btn ${filtroEstado === 'RECHAZADO' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('RECHAZADO')}
          >
            ❌ Rechazadas ({solicitudes.filter(s => s.estado === EstadoSolicitud.RECHAZADO).length})
          </button>
          <button
            className={`filter-btn ${filtroEstado === 'TODOS' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('TODOS')}
          >
            📋 Todas ({solicitudes.length})
          </button>
        </div>

        {/* Tabla de solicitudes */}
        {solicitudesFiltradas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No hay solicitudes {filtroEstado.toLowerCase()}</h3>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estudiante</th>
                  <th>Servicio</th>
                  <th>Categoría</th>
                  <th>Costo</th>
                  <th>Fecha Solicitud</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudesFiltradas.map(solicitud => (
                  <tr key={solicitud.id}>
                    <td>#{solicitud.id}</td>
                    <td>
                      <div>
                        <strong>{solicitud.usuario.nombre}</strong>
                        <br />
                        <small style={{ color: 'var(--text-secondary)' }}>
                          {solicitud.usuario.correo}
                        </small>
                      </div>
                    </td>
                    <td>{solicitud.servicio.nombre}</td>
                    <td>
                      <span className="badge badge-info">
                        {solicitud.servicio.categoria.nombre}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--success)' }}>
                        S/ {solicitud.servicio.precio.toFixed(2)}
                      </strong>
                    </td>
                    <td>{formatearFecha(solicitud.fechaSolicitud!)}</td>
                    <td>
                      <span className={`badge ${getEstadoBadge(solicitud.estado)}`}>
                        {solicitud.estado}
                      </span>
                    </td>
                    <td>
                      {solicitud.estado === EstadoSolicitud.PENDIENTE ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => setModalData({
                              solicitudId: solicitud.id!,
                              accion: 'aprobar',
                              observaciones: ''
                            })}
                            disabled={procesando === solicitud.id}
                          >
                            ✅ Aprobar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setModalData({
                              solicitudId: solicitud.id!,
                              accion: 'rechazar',
                              observaciones: ''
                            })}
                            disabled={procesando === solicitud.id}
                          >
                            ❌ Rechazar
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                          {solicitud.observaciones || 'Sin observaciones'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {modalData && (
        <div className="modal-overlay" onClick={() => setModalData(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              {modalData.accion === 'aprobar' ? '✅ Aprobar Solicitud' : '❌ Rechazar Solicitud'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {modalData.accion === 'aprobar'
                ? 'Puedes agregar observaciones opcionales para el estudiante.'
                : 'Debes proporcionar una razón para el rechazo.'}
            </p>

            <div className="form-group">
              <label>Observaciones {modalData.accion === 'rechazar' && '*'}</label>
              <textarea
                rows={4}
                placeholder={
                  modalData.accion === 'aprobar'
                    ? 'Ej: Aprobado. Pasar por ventanilla 3.'
                    : 'Ej: Documentación incompleta. Falta comprobante de pago.'
                }
                value={modalData.observaciones}
                onChange={(e) => setModalData({ ...modalData, observaciones: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setModalData(null)}
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button
                className={`btn ${modalData.accion === 'aprobar' ? 'btn-success' : 'btn-danger'}`}
                onClick={() => {
                  if (modalData.accion === 'aprobar') {
                    handleAprobar(modalData.solicitudId, modalData.observaciones);
                  } else {
                    handleRechazar(modalData.solicitudId, modalData.observaciones);
                  }
                }}
                disabled={procesando !== null}
                style={{ flex: 1 }}
              >
                {procesando ? '⏳ Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 32px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .modal h3 {
          margin-bottom: 12px;
          font-size: 24px;
        }
      `}</style>
    </div>
  );
}