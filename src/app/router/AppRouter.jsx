/**
 * Router Principal - Kallpa UNL
 * 
 * Configuración centralizada de todas las rutas del sistema.
 * Integra rutas públicas, protegidas y basadas en roles.
 * 
 * @version 1.0.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Componentes de rutas protegidas
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Constantes de rutas y roles
import { ROUTES } from '../config/constants';
import { ROLES } from '../config/roles';

// Páginas de Autenticación (públicas)
import LoginPage from '@/features/auth/pages/LoginPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';

// Páginas de Usuarios (admin)
import UserListPage from '@/features/users/pages/UserListPage';
import CreateUserPage from '@/features/users/pages/CreateUserPage';
import EditUserPage from '@/features/users/pages/EditUserPage';

// Páginas de Inscripción
import RegisterDeportistaPage from '@/features/inscription/pages/RegisterDeportistaPage';
import RegisterMenorPage from '@/features/inscription/pages/RegisterMenorPage';

// Páginas de Seguimiento
import EvaluationsPage from '@/features/seguimiento/pages/EvaluationsPage';
import StatisticsPage from '@/features/seguimiento/pages/StatisticsPage';
import ReportsPage from '@/features/seguimiento/pages/ReportsPage';

/**
 * Componente principal del Router
 * Configura todas las rutas de la aplicación
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS - Sin autenticación requerida */}
        
        {/* Página de inicio de sesión */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        
        {/* Recuperación de contraseña */}
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        
        {/* Restablecer contraseña con token */}
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        
        {/* RUTAS PROTEGIDAS - Requieren autenticación */}
        
        <Route element={<ProtectedRoute />}>
          {/* Dashboard principal - accesible por todos los usuarios autenticados */}
          <Route 
            path={ROUTES.DASHBOARD} 
            element={<div>Dashboard - En construcción</div>} 
          />
          
          {/* RUTAS DE USUARIOS - Solo ADMIN */}
          <Route 
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN]} />
            }
          >
            <Route path={ROUTES.USERS} element={<UserListPage />} />
            <Route path={ROUTES.USERS_CREATE} element={<CreateUserPage />} />
            <Route path={ROUTES.USERS_EDIT} element={<EditUserPage />} />
          </Route>
          
          {/* RUTAS DE INSCRIPCIÓN - ADMIN y ENTRENADOR */}
          <Route 
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.ENTRENADOR, ROLES.REPRESENTANTE]} />
            }
          >
            <Route path={ROUTES.INSCRIPTION_DEPORTISTA} element={<RegisterDeportistaPage />} />
            <Route path={ROUTES.INSCRIPTION_MENOR} element={<RegisterMenorPage />} />
          </Route>
          
          {/* RUTAS DE SEGUIMIENTO */}
          
          {/* Evaluaciones - ADMIN y ENTRENADOR */}
          <Route 
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.ENTRENADOR]} />
            }
          >
            <Route path={ROUTES.EVALUATIONS} element={<EvaluationsPage />} />
          </Route>
          
          {/* Estadísticas - Todos los autenticados */}
          <Route path={ROUTES.STATISTICS} element={<StatisticsPage />} />
          
          {/* Reportes - ADMIN, ENTRENADOR, DEPORTISTA */}
          <Route 
            element={
              <RoleRoute 
                allowedRoles={[ROLES.ADMIN, ROLES.ENTRENADOR, ROLES.DEPORTISTA, ROLES.REPRESENTANTE]} 
              />
            }
          >
            <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
          </Route>
        </Route>
        
        {/* REDIRECCIONES Y RUTAS POR DEFECTO */}
        
        {/* Ruta raíz redirige al dashboard */}
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        
        {/* Cualquier ruta no definida redirige al dashboard */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
