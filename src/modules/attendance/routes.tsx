import { Navigate, Route, Routes } from 'react-router-dom';

const AttendanceHome = () => (
    <div className="p-6">
        <h1 className="text-2xl font-bold">Asistencia</h1>
        <p className="text-base-content/70">Modulo de asistencia en construccion.</p>
    </div>
);

export const AttendanceRoutes = () => {
    return (
        <Routes>
            <Route index element={<AttendanceHome />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};
