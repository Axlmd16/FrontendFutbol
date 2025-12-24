import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminDashboard, CoachDashboard } from '../../modules/dashboard';
import { AuthenticatedLayout } from '../../shared/layouts/AuthenticatedLayout';
import type { Role } from '../types';

// Páginas placeholder para módulos en construcción
const AthletesPage = () => (
    <div className="space-y-4">
        <h1 className="text-2xl font-bold">Atletas</h1>
        <p className="text-base-content/70">Módulo de atletas en construcción.</p>
    </div>
);

const AttendancePage = () => (
    <div className="space-y-4">
        <h1 className="text-2xl font-bold">Asistencia</h1>
        <p className="text-base-content/70">Módulo de asistencia en construcción.</p>
    </div>
);

const AssessmentsPage = () => (
    <div className="space-y-4">
        <h1 className="text-2xl font-bold">Evaluaciones</h1>
        <p className="text-base-content/70">Módulo de evaluaciones en construcción.</p>
    </div>
);

const UsersPage = () => (
    <div className="space-y-4">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="text-base-content/70">Módulo de usuarios en construcción.</p>
    </div>
);

const ReportsPage = () => (
    <div className="space-y-4">
        <h1 className="text-2xl font-bold">Reportes</h1>
        <p className="text-base-content/70">Módulo de reportes en construcción.</p>
    </div>
);

const SettingsPage = () => (
    <div className="space-y-4">
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-base-content/70">Módulo de configuración en construcción.</p>
    </div>
);

type AppRoutesProps = {
    userRole: Role;
    userName: string;
    userEmail: string;
    onLogout: () => void;
};

export const AppRoutes = ({ userRole, userName, userEmail, onLogout }: AppRoutesProps) => {
    const DashboardComponent = userRole === 'Administrator' ? AdminDashboard : CoachDashboard;

    return (
        <Routes>
            <Route
                element={
                    <AuthenticatedLayout
                        userRole={userRole}
                        userName={userName}
                        userEmail={userEmail}
                        onLogout={onLogout}
                    />
                }
            >
                {/* Dashboard - diferente según rol */}
                <Route path="dashboard" element={<DashboardComponent />} />

                {/* Módulos comunes */}
                <Route path="athletes/*" element={<AthletesPage />} />
                <Route path="attendance/*" element={<AttendancePage />} />
                <Route path="assessments/*" element={<AssessmentsPage />} />

                {/* Módulos solo admin */}
                {userRole === 'Administrator' && (
                    <>
                        <Route path="users/*" element={<UsersPage />} />
                        <Route path="reports/*" element={<ReportsPage />} />
                        <Route path="settings/*" element={<SettingsPage />} />
                    </>
                )}

                {/* Redirección por defecto */}
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
