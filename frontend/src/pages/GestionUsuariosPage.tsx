import { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';
import type { Usuario } from '../types';
import { RolUsuario } from '../types';

export default function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroRol, setFiltroRol] = useState<string>('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    rol: RolUsuario.CLIENTE
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAll();
      setUsuarios(data);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtrarUsuarios = () => {
    let resultado = usuarios;

    if (filtroRol !== 'TODOS') {
      resultado = resultado.filter(u => u.rol === filtroRol);
    }

    if (busqueda) {
      resultado = resultado.filter(u =>
        u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.correo.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    return resultado;
  };

  const handleOpenModal = (usuario?: Usuario) => {
    if (usuario) {
      setEditingUser(usuario);
      setFormData({
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      });
    } else {
      setEditingUser(null);
      setFormData({
        nombre: '',
        correo: '',
        rol: RolUsuario.CLIENTE
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      nombre: '',
      correo: '',
      rol: RolUsuario.CLIENTE
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.correo.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      if (editingUser) {
        await usuarioService.update(editingUser.id!, {
          ...formData,
          id: editingUser.id
        });
        alert('✅ Usuario actualizado exitosamente');
      } else {
        await usuarioService.create(formData);
        alert('✅ Usuario creado exitosamente');
      }
      await cargarUsuarios();
      handleCloseModal();
    } catch (err) {
      alert('❌ Error al guardar el usuario');
      console.error(err);
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar al usuario "${nombre}"?`)) {
      return;
    }

    try {
      await usuarioService.delete(id);
      alert('✅ Usuario eliminado exitosamente');
      await cargarUsuarios();
    } catch (err) {
      alert('❌ Error al eliminar el usuario');
      console.error(err);
    }
  };

  const getRolBadge = (rol: string) => {
    const badges: Record<string, string> = {
      ADMIN: 'badge-warning',
      SOPORTE: 'badge-danger',
      CLIENTE: 'badge-info'
    };
    return badges[rol] || 'badge-info';
  };

  const getRolNombre = (rol: string) => {
    const nombres: Record<string, string> = {
      ADMIN: 'Administrativo',
      SOPORTE: 'Soporte',
      CLIENTE: 'Estudiante'
    };
    return nombres[rol] || rol;
  };

  if (loading) return <div className="loading">⏳ Cargando usuarios...</div>;
  if (error) return <div className="error">{error}</div>;

  const usuariosFiltrados = filtrarUsuarios();

  return (
    <div className="container">
      <div className="card">
        <div className="page-header">
          <div>
            <h2>👥 Gestión de Usuarios</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Administrar usuarios del sistema
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            ➕ Nuevo Usuario
          </button>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '250px', marginBottom: 0 }}>
            <label>🔍 Buscar</label>
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: '250px', marginBottom: 0 }}>
            <label>👤 Rol</label>
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
            >
              <option value="TODOS">Todos los roles</option>
              <option value={RolUsuario.CLIENTE}>Estudiantes</option>
              <option value={RolUsuario.ADMIN}>Administrativos</option>
              <option value={RolUsuario.SOPORTE}>Soporte</option>
            </select>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid" style={{ marginBottom: '24px' }}>
          <div className="card" style={{ marginBottom: 0, textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
            <h3>{usuarios.length}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Usuarios</p>
          </div>
          <div className="card" style={{ marginBottom: 0, textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎓</div>
            <h3>{usuarios.filter(u => u.rol === RolUsuario.CLIENTE).length}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Estudiantes</p>
          </div>
          <div className="card" style={{ marginBottom: 0, textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👔</div>
            <h3>{usuarios.filter(u => u.rol === RolUsuario.ADMIN).length}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Administrativos</p>
          </div>
          <div className="card" style={{ marginBottom: 0, textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔧</div>
            <h3>{usuarios.filter(u => u.rol === RolUsuario.SOPORTE).length}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Soporte</p>
          </div>
        </div>

        {/* Tabla de usuarios */}
        {usuariosFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No se encontraron usuarios</h3>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map(usuario => (
                  <tr key={usuario.id}>
                    <td>#{usuario.id}</td>
                    <td><strong>{usuario.nombre}</strong></td>
                    <td>{usuario.correo}</td>
                    <td>
                      <span className={`badge ${getRolBadge(usuario.rol)}`}>
                        {getRolNombre(usuario.rol)}
                      </span>
                    </td>
                    <td>
                      {new Date(usuario.fechaRegistro!).toLocaleDateString('es-PE')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleOpenModal(usuario)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(usuario.id!, usuario.nombre)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de crear/editar usuario */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingUser ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Juan Pérez García"
                  required
                />
              </div>

              <div className="form-group">
                <label>Correo Institucional *</label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  placeholder="ejemplo@unmsm.edu.pe"
                  required
                  disabled={!!editingUser}
                />
                {editingUser && (
                  <small style={{ color: 'var(--text-secondary)' }}>
                    El correo no se puede modificar
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Rol *</label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value as any })}
                >
                  <option value={RolUsuario.CLIENTE}>Estudiante</option>
                  <option value={RolUsuario.ADMIN}>Administrativo</option>
                  <option value={RolUsuario.SOPORTE}>Soporte Técnico</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {editingUser ? '💾 Guardar Cambios' : '➕ Crear Usuario'}
                </button>
              </div>
            </form>
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
          margin-bottom: 24px;
          font-size: 24px;
        }
      `}</style>
    </div>
  );
}