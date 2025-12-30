/**
 * EvaluationsPage - Página Principal de Evaluaciones
 *
 * Maneja la visualización de evaluaciones y navegación
 * entre diferentes vistas
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import EvaluationsList from "../components/EvaluationsList";
import EvaluationForm from "../components/EvaluationForm";
import EvaluationDetail from "../components/EvaluationDetail";
import AddTestsForm from "../components/AddTestsForm";

const EvaluationsPage = () => {
  return (
    <div className="p-6">
      <Routes>
        {/* Lista de evaluaciones */}
        <Route index element={<EvaluationsList />} />

        {/* Crear nueva evaluación */}
        <Route path="create" element={<EvaluationForm isEdit={false} />} />

        {/* Detalle y edición */}
        <Route path=":id" element={<EvaluationDetail />} />
        <Route path=":id/edit" element={<EvaluationForm isEdit={true} />} />
        <Route path=":id/add-tests" element={<AddTestsForm />} />
      </Routes>
    </div>
  );
};

export default EvaluationsPage;
