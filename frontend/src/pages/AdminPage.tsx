import { useState, useEffect } from 'react';
import { categoriaService } from '../services/categoriaService';
import { servicioService } from '../services/servicioService';
import type { CategoriaServicio, Servicio } from '../types';
import { EstadoServicio } from '../types';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'categorias' | 'servicios'>('categorias');

  return (
    <div className="container">
      <div className="card">
        <h2>⚙️ Panel de Administración</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '24px' }}>
          Gestión de categorías y servicios del sistema
        </p>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'categorias' ? 'active' : ''}`}
            onClick={() => setActiveTab('categorias')}
          >
            📂 Categorías
          </button>
          <button
            className={`tab ${activeTab === 'servicios' ? 'active' : ''}`}
            onClick={() => setActiveTab('servicios')}
          >
            🛠️ Servicios
          </button>
        </div>

        {activeTab === 'categorias' ? <CategoriasTab /> : <ServiciosTab />}
      </div>

      <style>{`
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          border-bottom: 2px solid var(--border);
        }
        .tab {
          padding: 12px 24px;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          color: var(--text-secondary);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          bottom: -2px;
        }
        .tab:hover {
          color: var(--text-primary);
          background: rgba(99, 102, 241, 0.05);
        }
        .tab.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab de Categorías (sin cambios funcionales)
// ─────────────────────────────────────────────────────────────
function CategoriasTab() {
  const [categorias, setCategorias] = useState<CategoriaServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<CategoriaServicio | null>(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });

  useEffect(() => { cargarCategorias(); }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const data = await categoriaService.getAll();
      setCategorias(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (categoria?: CategoriaServicio) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({ nombre: categoria.nombre, descripcion: categoria.descripcion });
    } else {
      setEditingCategoria(null);
      setFormData({ nombre: '', descripcion: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategoria(null);
    setFormData({ nombre: '', descripcion: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategoria) {
        await categoriaService.update(editingCategoria.id!, { ...formData, id: editingCategoria.id });
        alert('✅ Categoría actualizada');
      } else {
        await categoriaService.create(formData);
        alert('✅ Categoría creada');
      }
      await cargarCategorias();
      handleCloseModal();
    } catch {
      alert('❌ Error al guardar la categoría');
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar la categoría "${nombre}"?`)) return;
    try {
      await categoriaService.delete(id);
      alert('✅ Categoría eliminada');
      await cargarCategorias();
    } catch {
      alert('❌ Error. Puede que haya servicios asociados a esta categoría.');
    }
  };

  if (loading) return <div className="loading">⏳ Cargando...</div>;

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          ➕ Nueva Categoría
        </button>
      </div>

      <div className="grid">
        {categorias.map(categoria => (
          <div key={categoria.id} className="card" style={{ marginBottom: 0 }}>
            <h3>{categoria.nombre}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
              {categoria.descripcion}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal(categoria)}>
                ✏️ Editar
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(categoria.id!, categoria.nombre)}>
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}

        {categorias.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No hay categorías</h3>
            <p>Crea la primera categoría para comenzar</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editingCategoria ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal} style={{ flex: 1 }}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingCategoria ? '💾 Guardar' : '➕ Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab de Servicios — con correcciones RN-05 y RN-06
// ─────────────────────────────────────────────────────────────
function ServiciosTab() {
  const [servicios,  setServicios]  = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<CategoriaServicio[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoriaId: 0,
    estado: EstadoServicio.INACTIVO   // nuevo servicio empieza INACTIVO por defecto
  });
  const [precioError, setPrecioError] = useState('');

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [serviciosData, categoriasData] = await Promise.all([
        servicioService.getAll(),
        categoriaService.getAll()
      ]);
      setServicios(serviciosData);
      setCategorias(categoriasData);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (servicio?: Servicio) => {
    setPrecioError('');
    if (servicio) {
      setEditingServicio(servicio);
      setFormData({
        nombre:      servicio.nombre,
        descripcion: servicio.descripcion,
        precio:      servicio.precio,
        categoriaId: servicio.categoria.id!,
        estado:      servicio.estado
      });
    } else {
      setEditingServicio(null);
      setFormData({
        nombre: '', descripcion: '', precio: 0,
        categoriaId: categorias[0]?.id || 0,
        estado: EstadoServicio.INACTIVO
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingServicio(null);
    setPrecioError('');
  };

  // ── RN-06: validar precio positivo ───────────────────────
  const handlePrecioChange = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      setPrecioError('El precio debe ser mayor a S/ 0.00');
    } else {
      setPrecioError('');
    }
    setFormData({ ...formData, precio: isNaN(num) ? 0 : num });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── RN-06: bloquear submit si precio inválido ─────────
    if (formData.precio <= 0) {
      setPrecioError('El precio debe ser mayor a S/ 0.00');
      return;
    }

    const categoria = categorias.find(c => c.id === formData.categoriaId);
    if (!categoria) return;

    const servicioData: Servicio = {
      nombre:      formData.nombre,
      descripcion: formData.descripcion,
      precio:      formData.precio,
      categoria:   { id: formData.categoriaId, nombre: categoria.nombre, descripcion: categoria.descripcion },
      estado:      formData.estado,
    };

    try {
      if (editingServicio) {
        await servicioService.update(editingServicio.id!, servicioData);
        alert('✅ Servicio actualizado');
      } else {
        await servicioService.create(servicioData);
        alert('✅ Servicio creado');
      }
      await cargarDatos();
      handleCloseModal();
    } catch {
      alert('❌ Error al guardar el servicio');
    }
  };

  // ── RN-05: bloquear eliminación si está ACTIVO ───────────
  const handleDelete = async (servicio: Servicio) => {
    if (servicio.estado === EstadoServicio.ACTIVO) {
      alert('⚠️ No se puede eliminar un servicio activo. Desactívalo primero.');
      return;
    }
    if (!confirm(`¿Eliminar el servicio "${servicio.nombre}"?`)) return;
    try {
      await servicioService.delete(servicio.id!);
      alert('✅ Servicio eliminado');
      await cargarDatos();
    } catch {
      alert('❌ Error al eliminar el servicio');
    }
  };

  // ── Toggle estado con confirmación ───────────────────────
  const handleToggleEstado = async (servicio: Servicio) => {
    const nuevoEstado = servicio.estado === EstadoServicio.ACTIVO
      ? EstadoServicio.INACTIVO
      : EstadoServicio.ACTIVO;

    const accion = nuevoEstado === EstadoServicio.ACTIVO ? 'activar' : 'desactivar';
    if (!confirm(`¿Deseas ${accion} el servicio "${servicio.nombre}"?`)) return;

    try {
      await servicioService.cambiarEstado(servicio.id!, nuevoEstado);
      await cargarDatos();
    } catch {
      alert('❌ Error al cambiar el estado del servicio');
    }
  };

  if (loading) return <div className="loading">⏳ Cargando...</div>;

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          ➕ Nuevo Servicio
        </button>
      </div>

      {servicios.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛠️</div>
          <h3>No hay servicios</h3>
          <p>Crea el primer servicio del catálogo</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map(servicio => (
                <tr key={servicio.id}>
                  <td>
                    <strong>{servicio.nombre}</strong>
                    <br />
                    <small style={{ color: 'var(--text-secondary)' }}>{servicio.descripcion}</small>
                  </td>
                  <td>
                    <span className="badge badge-info">{servicio.categoria.nombre}</span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--success)' }}>S/ {servicio.precio.toFixed(2)}</strong>
                  </td>
                  <td>
                    <span className={`badge ${servicio.estado === EstadoServicio.ACTIVO ? 'badge-success' : 'badge-danger'}`}>
                      {servicio.estado}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {/* Toggle estado */}
                      <button
                        className={`btn btn-sm ${servicio.estado === EstadoServicio.ACTIVO ? 'btn-secondary' : 'btn-success'}`}
                        onClick={() => handleToggleEstado(servicio)}
                        title={servicio.estado === EstadoServicio.ACTIVO ? 'Desactivar servicio' : 'Activar servicio'}
                      >
                        {servicio.estado === EstadoServicio.ACTIVO ? '⏸️ Desactivar' : '▶️ Activar'}
                      </button>

                      {/* Editar */}
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenModal(servicio)}
                        title="Editar servicio"
                      >
                        ✏️
                      </button>

                      {/* Eliminar — RN-05: deshabilitado si está ACTIVO */}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(servicio)}
                        disabled={servicio.estado === EstadoServicio.ACTIVO}
                        title={
                          servicio.estado === EstadoServicio.ACTIVO
                            ? 'Desactiva el servicio antes de eliminarlo (RN-05)'
                            : 'Eliminar servicio'
                        }
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3>{editingServicio ? '✏️ Editar Servicio' : '➕ Nuevo Servicio'}</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Certificado de Estudios"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe brevemente el servicio..."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* ── RN-06: precio con validación ── */}
                <div className="form-group" style={{ marginBottom: precioError ? 0 : undefined }}>
                  <label>Precio (S/) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.precio || ''}
                    onChange={e => handlePrecioChange(e.target.value)}
                    placeholder="0.00"
                    required
                    style={precioError ? { borderColor: 'var(--danger)' } : {}}
                  />
                  {precioError && (
                    <small style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>
                      {precioError}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    value={formData.categoriaId}
                    onChange={e => setFormData({ ...formData, categoriaId: parseInt(e.target.value) })}
                    required
                  >
                    <option value={0} disabled>Selecciona una categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Estado *</label>
                <select
                  value={formData.estado}
                  onChange={e => setFormData({ ...formData, estado: e.target.value as EstadoServicio })}
                >
                  <option value={EstadoServicio.INACTIVO}>Inactivo</option>
                  <option value={EstadoServicio.ACTIVO}>Activo</option>
                </select>
                <small style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>
                  Los nuevos servicios se crean como Inactivos por defecto
                </small>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal} style={{ flex: 1 }}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingServicio ? '💾 Guardar cambios' : '➕ Crear servicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}