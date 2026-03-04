import { createContext, useContext, useState, ReactNode } from 'react';
import type { Usuario } from '../types';
import { usuarioService } from '../services/usuarioService';

interface AuthContextType {
  usuario: Usuario | null;
  login: (correo: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const savedUser = localStorage.getItem('usuario');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (correo: string): Promise<{ success: boolean; message: string }> => {
    try {
      const usuarioEncontrado = await usuarioService.getByCorreo(correo);

      // Verificar que el usuario retornado tenga los campos mínimos esperados
      if (
        !usuarioEncontrado ||
        !usuarioEncontrado.id ||
        !usuarioEncontrado.correo ||
        !usuarioEncontrado.rol
      ) {
        return {
          success: false,
          message: 'Usuario no encontrado. Verifica tu correo.'
        };
      }

      // Verificar que el correo coincida exactamente
      if (usuarioEncontrado.correo.toLowerCase() !== correo.toLowerCase()) {
        return {
          success: false,
          message: 'Usuario no encontrado. Verifica tu correo.'
        };
      }

      setUsuario(usuarioEncontrado);
      localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));

      return {
        success: true,
        message: 'Inicio de sesión exitoso'
      };
    } catch (error) {
      console.error('Error en login:', error);

      const err = error as { response?: { status: number } };

      if (err.response?.status === 404) {
        return {
          success: false,
          message: 'Usuario no encontrado. Verifica tu correo.'
        };
      }

      if (err.response?.status === 500) {
        return {
          success: false,
          message: 'Error en el servidor. Intenta de nuevo más tarde.'
        };
      }

      return {
        success: false,
        message: 'No se pudo conectar con el servidor. Verifica tu conexión.'
      };
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  const isAuthenticated = usuario !== null;

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}