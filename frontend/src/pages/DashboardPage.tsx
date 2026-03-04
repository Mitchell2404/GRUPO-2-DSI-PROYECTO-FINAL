import { useState, useEffect } from 'react';
import { servicioService } from '../services/servicioService';
import { solicitudService } from '../services/solicitudService';
import { usuarioService } from '../services/usuarioService';
import { categoriaService } from '../services/categoriaService';
import type { Servicio, SolicitudServicio, Usuario, CategoriaServicio } from '../types';
import { EstadoSolicitud, EstadoServicio, RolUsuario } from '../types';

export default function DashboardPage() {
  const [servicios,   setServicios]   = useState<Servicio[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudServicio[]>([]);
  const [usuarios,    setUsuarios]    = useState<Usuario[]>([]);
  const [categorias,  setCategorias]  = useState<CategoriaServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [svcs, sols, usrs, cats] = await Promise.all([
        servicioService.getAll(),
        solicitudService.getAll(),
        usuarioService.getAll(),
        categoriaService.getAll(),
      ]);
      setServicios(svcs);
      setSolicitudes(sols);
      setUsuarios(usrs);
      setCategorias(cats);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">⏳ Cargando reportes...</div>;
  if (error)   return <div className="error">{error}</div>;

  // ── Cálculos ────────────────────────────────────────────
  const serviciosActivos   = servicios.filter(s => s.estado === EstadoServicio.ACTIVO).length;
  const serviciosInactivos = servicios.filter(s => s.estado === EstadoServicio.INACTIVO).length;
  const pendientes  = solicitudes.filter(s => s.estado === EstadoSolicitud.PENDIENTE).length;
  const aprobadas   = solicitudes.filter(s => s.estado === EstadoSolicitud.APROBADO).length;
  const rechazadas  = solicitudes.filter(s => s.estado === EstadoSolicitud.RECHAZADO).length;
  const clientes    = usuarios.filter(u => u.rol === RolUsuario.CLIENTE).length;
  const admins      = usuarios.filter(u => u.rol === RolUsuario.ADMIN).length;
  const soporteU    = usuarios.filter(u => u.rol === RolUsuario.SOPORTE).length;

  // Top 5 servicios más solicitados
  const conteo: Record<number, { nombre: string; count: number }> = {};
  solicitudes.forEach(sol => {
    const id = sol.servicio?.id;
    if (id !== undefined) {
      if (!conteo[id]) conteo[id] = { nombre: sol.servicio?.nombre ?? '—', count: 0 };
      conteo[id].count++;
    }
  });
  const topServicios = Object.values(conteo)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 6 solicitudes más recientes
  const recientes = [...solicitudes]
    .sort((a, b) =>
      new Date(b.fechaSolicitud!).getTime() - new Date(a.fechaSolicitud!).getTime()
    )
    .slice(0, 6);

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

  const getEstadoBadge = (estado: string) => {
    const map: Record<string, string> = {
      PENDIENTE: 'badge-warning',
      APROBADO:  'badge-success',
      RECHAZADO: 'badge-danger',
    };
    return map[estado] ?? 'badge-info';
  };

  return (
    <div className="container">

      {/* ── Encabezado ── */}
      <div className="card">
        <h2>📊 Reportes y Estadísticas</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Resumen general del estado del catálogo de servicios
        </p>
      </div>

      {/* ── Tarjetas de estadísticas ── */}
      <div className="grid">
        <StatCard icon="📦" label="Servicios Activos"       value={serviciosActivos}   colorClass="stat-success"   />
        <StatCard icon="🔒" label="Servicios Inactivos"     value={serviciosInactivos} colorClass="stat-danger"    />
        <StatCard icon="📁" label="Categorías"              value={categorias.length}  colorClass="stat-primary"   />
        <StatCard icon="⏳" label="Solicitudes Pendientes"  value={pendientes}         colorClass="stat-warning"   />
        <StatCard icon="✅" label="Solicitudes Aprobadas"   value={aprobadas}          colorClass="stat-success"   />
        <StatCard icon="❌" label="Solicitudes Rechazadas"  value={rechazadas}         colorClass="stat-danger"    />
        <StatCard icon="🎓" label="Estudiantes"             value={clientes}           colorClass="stat-primary"   />
        <StatCard icon="🛡️" label="Staff (Admin + Soporte)" value={admins + soporteU}  colorClass="stat-secondary" />
      </div>

      {/* ── Top servicios + Distribución ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Top servicios */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ marginBottom: '20px' }}>🔥 Servicios Más Solicitados</h3>
          {topServicios.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <div className="empty-icon">📭</div>
              <p>Sin solicitudes aún</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {topServicios.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    className={`badge ${i === 0 ? 'badge-warning' : 'badge-info'}`}
                    style={{ minWidth: '26px', justifyContent: 'center' }}
                  >
                    {i + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '14px', fontWeight: 500,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      color: 'var(--text-primary)', marginBottom: '4px',
                    }}>
                      {s.nombre}
                    </div>
                    <div style={{ height: '4px', borderRadius: '2px', background: 'var(--border)' }}>
                      <div style={{
                        height: '100%', borderRadius: '2px',
                        background: 'var(--gradient)',
                        width: `${Math.round((s.count / (topServicios[0]?.count || 1)) * 100)}%`,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {s.count} sol.
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Distribución */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ marginBottom: '20px' }}>📈 Distribución de Solicitudes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <BarEstado label="⏳ Pendientes" count={pendientes} total={solicitudes.length} color="var(--warning)" />
            <BarEstado label="✅ Aprobadas"  count={aprobadas}  total={solicitudes.length} color="var(--success)" />
            <BarEstado label="❌ Rechazadas" count={rechazadas} total={solicitudes.length} color="var(--danger)"  />
          </div>
          <div style={{
            marginTop: '28px', paddingTop: '20px',
            borderTop: '1px solid var(--border)', textAlign: 'center',
          }}>
            <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {solicitudes.length}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Total de solicitudes registradas
            </p>
          </div>
        </div>
      </div>

      {/* ── Solicitudes recientes ── */}
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>🕐 Solicitudes Recientes</h3>
        {recientes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No hay solicitudes</h3>
            <p>Aún no se han registrado solicitudes en el sistema</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estudiante</th>
                  <th>Servicio</th>
                  <th>Precio</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recientes.map(sol => (
                  <tr key={sol.id}>
                    <td>#{sol.id}</td>
                    <td>
                      <div>
                        <strong>{sol.usuario?.nombre}</strong>
                        <br />
                        <small style={{ color: 'var(--text-secondary)' }}>
                          {sol.usuario?.correo}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div>
                        {sol.servicio?.nombre}
                        <br />
                        <small style={{ color: 'var(--text-secondary)' }}>
                          {sol.servicio?.categoria?.nombre}
                        </small>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--success)' }}>
                        S/ {sol.servicio?.precio?.toFixed(2)}
                      </strong>
                    </td>
                    <td>{sol.fechaSolicitud ? formatearFecha(sol.fechaSolicitud) : '—'}</td>
                    <td>
                      <span className={`badge ${getEstadoBadge(sol.estado)}`}>
                        {sol.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

// ── Sub-componentes ────────────────────────────────────────

function StatCard({ icon, label, value, colorClass }: {
  icon: string;
  label: string;
  value: number;
  colorClass: string;
}) {
  return (
    <div className={`card stat-card ${colorClass}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function BarEstado({ label, count, total, color }: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginBottom: '6px', fontSize: '14px',
      }}>
        <span style={{ color: 'var(--text-primary)' }}>{label}</span>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
          {count} <span style={{ fontWeight: 400 }}>({pct}%)</span>
        </span>
      </div>
      <div style={{ height: '8px', borderRadius: '4px', background: 'var(--border)' }}>
        <div style={{
          height: '100%', borderRadius: '4px',
          background: color,
          width: `${pct}%`,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}