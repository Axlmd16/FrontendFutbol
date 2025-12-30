/**
 * AddTestsForm Component
 *
 * Formulario modular para agregar tests por tipo a una evaluación
 */

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import {
  useCreateSprintTest,
  useCreateYoyoTest,
  useCreateEnduranceTest,
  useCreateTechnicalAssessment,
  useEvaluationById,
} from "../hooks/useEvaluations";
import SprintTestForm from "./tests/SprintTestForm";
import YoyoTestForm from "./tests/YoyoTestForm";
import EnduranceTestForm from "./tests/EnduranceTestForm";
import TechnicalAssessmentForm from "./tests/TechnicalAssessmentForm";

const AddTestsForm = () => {
  const navigate = useNavigate();
  const { id: evaluationId } = useParams();
  const [selectedTest, setSelectedTest] = useState(null);

  const { data: evaluationData, isLoading } = useEvaluationById(evaluationId);

  const createSprintTest = useCreateSprintTest();
  const createYoyoTest = useCreateYoyoTest();
  const createEnduranceTest = useCreateEnduranceTest();
  const createTechnicalAssessment = useCreateTechnicalAssessment();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const evaluation = evaluationData?.data;

  const testTypes = [
    {
      id: "sprint",
      label: "Test de Velocidad (Sprint)",
      description: "Evaluación de aceleración y velocidad",
      icon: "⚡",
    },
    {
      id: "yoyo",
      label: "Test Yoyo",
      description: "Evaluación de resistencia intermitente",
      icon: "🔄",
    },
    {
      id: "endurance",
      label: "Test de Resistencia",
      description: "Evaluación aeróbica y capacidad cardiovascular",
      icon: "💪",
    },
    {
      id: "technical",
      label: "Evaluación Técnica",
      description: "Habilidades técnicas del deportista",
      icon: "⚽",
    },
  ];

  if (!selectedTest) {
    return (
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(`/seguimiento/evaluations/${evaluationId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Agregar Tests
            </h1>
            <p className="text-gray-600">
              Evaluación: {evaluation?.name}
            </p>
          </div>
        </div>

        {/* Selector de tipo de test */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testTypes.map((test) => (
            <button
              key={test.id}
              onClick={() => setSelectedTest(test.id)}
              className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-left"
            >
              <div className="text-4xl mb-3">{test.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {test.label}
              </h3>
              <p className="text-sm text-gray-600">{test.description}</p>
            </button>
          ))}
        </div>

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900">
            ℹ️ Selecciona el tipo de test que deseas agregar. Puedes agregar
            múltiples tests del mismo tipo a diferentes deportistas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setSelectedTest(null)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {testTypes.find((t) => t.id === selectedTest)?.label}
          </h1>
          <p className="text-gray-600">
            Evaluación: {evaluation?.name}
          </p>
        </div>
      </div>

      {/* Formulario por tipo */}
      {selectedTest === "sprint" && (
        <SprintTestForm
          evaluationId={evaluationId}
          mutation={createSprintTest}
          onSuccess={() => {
            setTimeout(() => {
              setSelectedTest(null);
            }, 1500);
          }}
        />
      )}

      {selectedTest === "yoyo" && (
        <YoyoTestForm
          evaluationId={evaluationId}
          mutation={createYoyoTest}
          onSuccess={() => {
            setTimeout(() => {
              setSelectedTest(null);
            }, 1500);
          }}
        />
      )}

      {selectedTest === "endurance" && (
        <EnduranceTestForm
          evaluationId={evaluationId}
          mutation={createEnduranceTest}
          onSuccess={() => {
            setTimeout(() => {
              setSelectedTest(null);
            }, 1500);
          }}
        />
      )}

      {selectedTest === "technical" && (
        <TechnicalAssessmentForm
          evaluationId={evaluationId}
          mutation={createTechnicalAssessment}
          onSuccess={() => {
            setTimeout(() => {
              setSelectedTest(null);
            }, 1500);
          }}
        />
      )}
    </div>
  );
};

export default AddTestsForm;
