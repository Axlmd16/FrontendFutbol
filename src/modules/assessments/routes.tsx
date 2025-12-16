import { Navigate, Route, Routes } from 'react-router-dom';

const AssessmentsHome = () => (
    <div className="p-6">
        <h1 className="text-2xl font-bold">Evaluaciones</h1>
        <p className="text-base-content/70">Modulo de evaluaciones en construccion.</p>
    </div>
);

export const AssessmentsRoutes = () => {
    return (
        <Routes>
            <Route index element={<AssessmentsHome />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};
