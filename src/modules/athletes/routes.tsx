import { Navigate, Route, Routes } from 'react-router-dom';

const AthletesHome = () => (
    <div className="p-6">
        <h1 className="text-2xl font-bold">Atletas</h1>
        <p className="text-base-content/70">Modulo de atletas en construccion.</p>
    </div>
);

export const AthletesRoutes = () => {
    return (
        <Routes>
            <Route index element={<AthletesHome />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};
