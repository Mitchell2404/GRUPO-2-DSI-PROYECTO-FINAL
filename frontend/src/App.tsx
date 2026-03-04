import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ServiciosPage from './pages/ServiciosPage';
import MisSolicitudesPage from './pages/MisSolicitudesPage';
import GestionSolicitudesPage from './pages/GestionSolicitudesPage';
import GestionUsuariosPage from './pages/GestionUsuariosPage';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage'; // ✅ AGREGADO
import { RolUsuario } from './types';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                
                <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                  <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                  
                  <Routes>
                    {/* Catálogo de Servicios - TODOS */}
                    <Route path="/" element={<ServiciosPage />} />
                    
                    {/* Mis Solicitudes - Solo CLIENTES */}
                    <Route 
                      path="/mis-solicitudes" 
                      element={
                        <ProtectedRoute allowedRoles={[RolUsuario.CLIENTE]}>
                          <MisSolicitudesPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Gestión de Solicitudes - ADMIN y SOPORTE */}
                    <Route 
                      path="/gestion-solicitudes" 
                      element={
                        <ProtectedRoute allowedRoles={[RolUsuario.ADMIN, RolUsuario.SOPORTE]}>
                          <GestionSolicitudesPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Reportes - ADMIN y SOPORTE ✅ CORREGIDO */}
                    <Route 
                      path="/reportes" 
                      element={
                        <ProtectedRoute allowedRoles={[RolUsuario.ADMIN, RolUsuario.SOPORTE]}>
                          <DashboardPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Gestión de Usuarios - ADMIN y SOPORTE ✅ CORREGIDO */}
                    <Route 
                      path="/usuarios" 
                      element={
                        <ProtectedRoute allowedRoles={[RolUsuario.ADMIN, RolUsuario.SOPORTE]}>
                          <GestionUsuariosPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Administración - ADMIN y SOPORTE ✅ CORREGIDO */}
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute allowedRoles={[RolUsuario.ADMIN, RolUsuario.SOPORTE]}>
                          <AdminPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Ruta por defecto */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>

                  <Footer />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;