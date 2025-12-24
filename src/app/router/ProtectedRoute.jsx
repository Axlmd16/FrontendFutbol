/**
 * ==============================================
 * Ruta Protegida - Kallpa UNL
 * ==============================================
 * 
 * Componente que protege rutas que requieren autenticación.
 * Verifica la existencia de un token válido antes de permitir
 * el acceso a las rutas hijas.
 * 
 * @author Kallpa UNL Team
 * @version 1.0.0
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AUTH_TOKEN_KEY, ROUTES } from '../config/constants';

/**
 * ProtectedRoute - Componente de orden superior para rutas protegidas
 * 
 * Funcionalidad:
 * - Verifica si existe un token de autenticación
 * - Si existe, renderiza las rutas hijas (Outlet)
 * - Si no existe, redirige al login guardando la ubicación actual
 * 
 * @returns {JSX.Element} Outlet con rutas hijas o redirección al login
 */
const ProtectedRoute = () => {
  // Obtener la ubicación actual para guardarla antes de redirigir
  const location = useLocation();
  
  // Verificar si existe token en localStorage
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  
  // Si no hay token, el usuario no está autenticado
  if (!token) {
    // Redirigir al login guardando la ubicación actual
    // El state.from permite volver a la página original después del login
    return (
      <Navigate 
        to={ROUTES.LOGIN} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }
  
  // Si hay token, renderizar las rutas hijas
  // Outlet es un componente de React Router que renderiza
  // las rutas anidadas definidas en el componente padre
  return <Outlet />;
};

export default ProtectedRoute;
