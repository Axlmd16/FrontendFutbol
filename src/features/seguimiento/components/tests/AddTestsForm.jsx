/**
 * AddTestsForm Component
 *
 * Formulario modular para agregar tests por tipo a una evaluación
 */

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader, UserCheck, Users } from "lucide-react";
import {
  useCreateSprintTest,
  useCreateYoyoTest,
  useCreateEnduranceTest,
  useCreateTechnicalAssessment,
  useEvaluationById,
} from "../../hooks/useEvaluations";
import SprintTestForm from "./SprintTestForm";
import YoyoTestForm from "./YoyoTestForm";
import EnduranceTestForm from "./EnduranceTestForm";
import TechnicalAssessmentForm from "./TechnicalAssessmentForm";
import AthletesSelectionList from "./AthletesSelectionList";

const AddTestsForm = () => {
  const navigate = useNavigate();
  const { id: evaluationId } = useParams();
  const [selectedTest, setSelectedTest] = useState(null);
  const [step, setStep] = useState("athlete"); // athlete -> testType -> form
  const [selectedAthleteIds, setSelectedAthleteIds] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);

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
    if (step === "athlete") {
      return (
        <div className="space-y-6">
          {/* Encabezado */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() =>
                navigate(`/seguimiento/evaluations/${evaluationId}`)
              }
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Selecciona un atleta
              </h1>
              <p className="text-gray-600">Evaluación: {evaluation?.name}</p>
            </div>
          </div>

          {/* Lista de atletas (single select) */}
          <AthletesSelectionList
            selectedAthleteIds={selectedAthleteIds}
            onSelectionChange={setSelectedAthleteIds}
            multiSelect={false}
            onSelectedAthleteChange={setSelectedAthlete}
          />

          <div className="flex justify-end">
            <button
              onClick={() => {
                if (selectedAthlete) {
                  setStep("testType");
                }
              }}
              disabled={!selectedAthlete}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
            >
              <UserCheck size={18} />
              Continuar con este atleta
            </button>
          </div>
        </div>
      );
    }

    // Paso 2: elegir tipo de test
    if (step === "testType") {
      return (
        <div className="space-y-6">
          {/* Encabezado */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setStep("athlete")}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Agregar Tests
              </h1>
              <p className="text-gray-600">Evaluación: {evaluation?.name}</p>
            </div>
          </div>

          {/* Resumen del atleta seleccionado */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={20} />
              <div>
                <p className="text-base font-semibold text-gray-900">
                  {selectedAthlete?.full_name || "Nombre no disponible"}
                </p>
                <p className="text-sm text-gray-600">
                  DNI: {selectedAthlete?.dni || "No disponible"}
                </p>
                <p className="text-sm text-gray-600">
                  Tipo: {selectedAthlete?.type_athlete || "Tipo no disponible"}
                </p>
                <p className="text-sm text-gray-600">
                  Altura:{" "}
                  {selectedAthlete?.height
                    ? `${selectedAthlete.height} cm`
                    : "No disponible"}
                </p>
                <p className="text-sm text-gray-600">
                  Peso:{" "}
                  {selectedAthlete?.weight
                    ? `${selectedAthlete.weight} kg`
                    : "No disponible"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setStep("athlete")}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Cambiar atleta
            </button>
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
              ℹ️ Selecciona el tipo de test que deseas agregar. Se creará para
              el atleta seleccionado.
            </p>
          </div>
        </div>
      );
    }
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
          <p className="text-gray-600">Evaluación: {evaluation?.name}</p>
        </div>
      </div>

      {/* Formulario por tipo */}
      {selectedTest === "sprint" && (
        <SprintTestForm
          evaluationId={evaluationId}
          selectedAthlete={selectedAthlete}
          hideAthleteSelector
          mutation={createSprintTest}
          onSuccess={() => {
            setTimeout(() => {
              setSelectedTest(null);
              setStep("testType");
            }, 1500);
          }}
        />
      )}

      {selectedTest === "yoyo" && (
        <YoyoTestForm
          evaluationId={evaluationId}
          selectedAthlete={selectedAthlete}
          hideAthleteSelector
          mutation={createYoyoTest}
          onSuccess={() => {
            setTimeout(() => {
              setSelectedTest(null);
              setStep("testType");
            }, 1500);
          }}
        />
      )}

      {selectedTest === "endurance" && (
        <EnduranceTestForm
          evaluationId={evaluationId}
          selectedAthlete={selectedAthlete}
          hideAthleteSelector
          mutation={createEnduranceTest}
          onSuccess={() => {
            setTimeout(() => {
              setSelectedTest(null);
              setStep("testType");
            }, 1500);
          }}
        />
      )}

      {selectedTest === "technical" && (
        <TechnicalAssessmentForm
          evaluationId={evaluationId}
          selectedAthlete={selectedAthlete}
          hideAthleteSelector
          mutation={createTechnicalAssessment}
          onSuccess={() => {
            setTimeout(() => {
              setSelectedTest(null);
              setStep("testType");
            }, 1500);
          }}
        />
      )}
    </div>
  );
};

export default AddTestsForm;
