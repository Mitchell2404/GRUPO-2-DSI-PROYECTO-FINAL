import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!correo) {
      setError('Por favor ingresa tu correo');
      return;
    }

    if (!correo.includes('@')) {
      setError('Por favor ingresa un correo válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(correo);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch {
      setError('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Catálogo de Servicios</h1>
          <p>Universidad Nacional Mayor de San Marcos</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Iniciar Sesión</h2>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="correo">Correo Institucional</label>
            <input
              id="correo"
              type="email"
              placeholder="ejemplo@unmsm.edu.pe"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                setError('');
              }}
              disabled={loading}
              autoFocus
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              Usa el correo registrado en el sistema
            </small>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>

          <div className="login-footer">
            <p>
              ¿No tienes cuenta?{' '}
              <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}