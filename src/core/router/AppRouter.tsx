import { type ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminRoutes } from '../../modules/admin/routes';
import { AssessmentsRoutes } from '../../modules/assessments/routes';
import { AthletesRoutes } from '../../modules/athletes/routes';
import { AttendanceRoutes } from '../../modules/attendance/routes';
import { AuthRoutes } from '../../modules/auth/routes';
import LandingPage from '../../shared/pages/Home/LandingPage';

export const AppRouter = () => {
    const status: string = 'not-authenticated';
    const isAuthenticated = status === 'authenticated';

    const withAuth = (element: ReactElement) =>
        isAuthenticated ? element : <Navigate to="/auth/login" replace />;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth/*" element={<AuthRoutes />} />
                <Route path="/admin/*" element={withAuth(<AdminRoutes />)} />
                <Route path="/attendance/*" element={withAuth(<AttendanceRoutes />)} />
                <Route path="/athletes/*" element={withAuth(<AthletesRoutes />)} />
                <Route path="/assessments/*" element={withAuth(<AssessmentsRoutes />)} />
                <Route
                    path="/app/*"
                    element={withAuth(<Navigate to="/admin" replace />)}
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
