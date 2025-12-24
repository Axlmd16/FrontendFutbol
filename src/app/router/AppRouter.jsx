/**
 * Router Principal - Kallpa UNL
 *
 * Configuración centralizada de todas las rutas del sistema.
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Componentes de rutas protegidas
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// Constantes de rutas y roles
import { ROUTES } from "../config/constants";
import { ROLES } from "../config/roles";

// Layout privado (con sidebar)
import DashboardLayout from "@/app/layouts/DashboardLayout";

// Páginas de Autenticación (públicas)
import LoginPage from "@/features/auth/pages/LoginPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

// Páginas públicas (Landing / Registro)
import LandingPage from "@/features/landing/pages/LandingPage";
import RegisterChoicePage from "@/features/registration/pages/RegisterChoicePage";
import RegisterSchoolPage from "@/features/registration/pages/RegisterSchoolPage";
import RegisterClubPage from "@/features/registration/pages/RegisterClubPage";

// Páginas de Usuarios (admin)
import UserListPage from "@/features/users/pages/UserListPage";
import CreateUserPage from "@/features/users/pages/CreateUserPage";
import EditUserPage from "@/features/users/pages/EditUserPage";

// Páginas de Inscripción
import RegisterDeportistaPage from "@/features/inscription/pages/RegisterDeportistaPage";
import RegisterMenorPage from "@/features/inscription/pages/RegisterMenorPage";

// Páginas de Seguimiento
import EvaluationsPage from "@/features/seguimiento/pages/EvaluationsPage";
import StatisticsPage from "@/features/seguimiento/pages/StatisticsPage";
import ReportsPage from "@/features/seguimiento/pages/ReportsPage";
import AttendancePage from "@/features/seguimiento/pages/AttendancePage";

// Dashboards por rol
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

// Perfil de usuario
import ProfilePage from "@/features/profile/pages/ProfilePage";

/**
 * Componente principal del Router
 * Configura todas las rutas de la aplicación
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS*/}

        {/* Landing */}
        <Route path={ROUTES.LANDING} element={<LandingPage />} />

        {/* Registro público */}
        <Route path={ROUTES.REGISTER} element={<RegisterChoicePage />} />
        <Route path={ROUTES.REGISTER_SCHOOL} element={<RegisterSchoolPage />} />
        <Route path={ROUTES.REGISTER_CLUB} element={<RegisterClubPage />} />

        {/* Pag de iniciar sesion */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        {/* Recuperar contraseña */}
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

        {/* Restablecer cnotraseña */}
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

        {/* RUTAS PROTEGIDAS - Requieren autenticación */}

        <Route element={<ProtectedRoute />}>
          {/* Layout privado con Sidebar */}
          <Route element={<DashboardLayout />}>
            {/* Dashboard principal - accesible por todos los usuarios autenticados */}
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

            {/* RUTAS DE USUARIOS - Solo ADMIN */}
            <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route path={ROUTES.USERS} element={<UserListPage />} />
              <Route path={ROUTES.USERS_CREATE} element={<CreateUserPage />} />
              <Route path={ROUTES.USERS_EDIT} element={<EditUserPage />} />
            </Route>

            {/* RUTAS DE INSCRIPCIÓN - ADMIN y ENTRENADOR */}
            <Route
              element={
                <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.ENTRENADOR]} />
              }
            >
              <Route
                path={ROUTES.INSCRIPTION_DEPORTISTA}
                element={<RegisterDeportistaPage />}
              />
              <Route
                path={ROUTES.INSCRIPTION_MENOR}
                element={<RegisterMenorPage />}
              />
            </Route>

            {/* RUTAS DE SEGUIMIENTO */}

            {/* Evaluaciones - Todos los autenticados */}
            <Route path={ROUTES.EVALUATIONS} element={<EvaluationsPage />} />

            {/* Estadísticas - Todos los autenticados */}
            <Route path={ROUTES.STATISTICS} element={<StatisticsPage />} />

            {/* Reportes - Todos los autenticados*/}
            <Route path={ROUTES.REPORTS} element={<ReportsPage />} />

            {/* Asistencia - Todos los autenticados */}
            <Route path={ROUTES.ATTENDANCE} element={<AttendancePage />} />

            {/* Perfil - Todos los autenticados */}
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          </Route>
        </Route>

        {/* REDIRECCIONES Y RUTAS POR DEFECTO */}

        {/* Cualquier ruta no definida redirige al inicio */}
        <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
