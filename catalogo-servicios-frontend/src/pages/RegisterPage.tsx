import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import { RolUsuario } from '../types';
import './LoginPage.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    rol: RolUsuario.CLIENTE
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!formData.correo.trim()) {
      setError('El correo es obligatorio');
      return;
    }

    if (!formData.correo.includes('@')) {
      setError('Por favor ingresa un correo válido');
      return;
    }

    if (!formData.correo.endsWith('@unmsm.edu.pe')) {
      setError('Debes usar un correo institucional (@unmsm.edu.pe)');
      return;
    }

    setLoading(true);

    try {
      await usuarioService.create({
        nombre: formData.nombre,
        correo: formData.correo,
        rol: formData.rol
      });

      alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      console.error('Error al crear cuenta:', err);
      
      const error = err as { response?: { data?: string } };
      
      if (error.response?.data) {
        setError(error.response.data);
      } else {
        setError('Error al crear la cuenta. El correo podría estar en uso.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Crear Cuenta</h1>
          <p>Universidad Nacional Mayor de San Marcos</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Registro de Usuario</h2>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ej: Juan Pérez García"
              value={formData.nombre}
              onChange={handleChange}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Institucional</label>
            <input
              id="correo"
              name="correo"
              type="email"
              placeholder="ejemplo@unmsm.edu.pe"
              value={formData.correo}
              onChange={handleChange}
              disabled={loading}
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              Debe ser un correo @unmsm.edu.pe
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="rol">Tipo de Usuario</label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              disabled={loading}
            >
              <option value={RolUsuario.CLIENTE}>Estudiante</option>
              <option value={RolUsuario.ADMIN}>Administrativo</option>
              <option value={RolUsuario.SOPORTE}>Soporte Técnico</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          <div className="login-footer">
            <p>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}