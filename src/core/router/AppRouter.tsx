import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthRoutes } from '../../modules/auth/routes';
import LandingPage from '../../shared/pages/Home/LandingPage';
import AppRoutes from './AppRoutes';
import type { Role } from '../types';

// TODO: Reemplazar con estado real de autenticación (context/store)
const useMockAuth = () => {
    // Cambiar estos valores para probar diferentes estados:
    // - status: 'authenticated' | 'not-authenticated'
    // - userRole: 'Administrator' | 'Coach'
    const status: string = 'authenticated';
    const userRole: Role = 'Coach';
    const userName = 'Juan Pérez';
    const userEmail = 'juan.perez@example.com';

    const logout = () => {
        console.log('Logout');
        // TODO: Implementar logout real
    };

    return {
        isAuthenticated: status === 'authenticated',
        userRole,
        userName,
        userEmail,
        logout,
    };
};

export const AppRouter = () => {
    const { isAuthenticated, userRole, userName, userEmail, logout } = useMockAuth();

    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth/*" element={<AuthRoutes />} />

                {/* Rutas protegidas */}
                <Route
                    path="/app/*"
                    element={
                        isAuthenticated ? (
                            <AppRoutes
                                userRole={userRole}
                                userName={userName}
                                userEmail={userEmail}
                                onLogout={logout}
                            />
                        ) : (
                            <Navigate to="/auth/login" replace />
                        )
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
