/**
 * EvaluationDetail Component
 *
 * Muestra los detalles de una evaluación
 * y permite agregar tests
 */

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit2, ArrowLeft, Plus, Loader } from "lucide-react";
import { useEvaluationById, useTestsByEvaluation } from "../hooks/useEvaluations";
import { useQuery } from "@tanstack/react-query";
import athletesApi from "../services/athletes.api";
import { formatDate, formatTime } from "@/shared/utils/dateUtils";

const EvaluationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [filterTestType, setFilterTestType] = React.useState("all");
  const [searchAthlete, setSearchAthlete] = React.useState("");

  const { data, isLoading, error } = useEvaluationById(id);
  const { data: testsData, isLoading: testsLoading } = useTestsByEvaluation(id);
  
  const evaluation = data?.data;
  const allTests = testsData?.all || [];

  // Hook para obtener datos de atletas con caché
  const { data: athletesData, isLoading: athletesLoading } = useQuery({
    queryKey: ["athletes", "all"],
    queryFn: () => athletesApi.getAll({ page: 1, limit: 100 }),
    staleTime: 10 * 60 * 1000,
  });

  const athletes = React.useMemo(() => {
    // La API devuelve { items: [...], total, page, limit }
    if (!athletesData) return [];
    
    // Si tiene la estructura paginada
    if (athletesData.items && Array.isArray(athletesData.items)) {
      return athletesData.items;
    }
    
    // Si tiene la estructura de ResponseSchema { status, message, data: ... }
    if (athletesData.data) {
      if (Array.isArray(athletesData.data)) {
        return athletesData.data;
      }
      if (athletesData.data.items && Array.isArray(athletesData.data.items)) {
        return athletesData.data.items;
      }
    }
    
    // Si directamente es un array
    if (Array.isArray(athletesData)) {
      return athletesData;
    }
    
    return [];
  }, [athletesData]);
  
  // Función auxiliar para obtener nombre del atleta
  const getAthleteName = React.useCallback((athleteId) => {
    if (!athletes || athletes.length === 0) {
      return `Atleta ${athleteId}`;
    }
    
    const athlete = athletes.find(a => a.id === athleteId);
    
    if (!athlete) {
      return `Atleta ${athleteId}`;
    }
    
    // Intenta primero full_name (estructura del backend)
    if (athlete.full_name) {
      return athlete.full_name;
    }
    
    // Si no existe full_name, intenta first_name + last_name
    const firstName = athlete.first_name || athlete.firstName || '';
    const lastName = athlete.last_name || athlete.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    
    if (firstName) {
      return firstName;
    }
    
    if (lastName) {
      return lastName;
    }
    
    return `Atleta ${athleteId}`;
  }, [athletes]);

  // Filtrar tests según el tipo seleccionado y búsqueda de atleta
  const filteredTests = React.useMemo(() => {
    let filtered = allTests;
    
    // Filtrar por tipo
    if (filterTestType !== "all") {
      filtered = filtered.filter(test => test.test_type === filterTestType);
    }
    
    // Filtrar por nombre de atleta si hay búsqueda
    if (searchAthlete.trim()) {
      filtered = filtered.filter(test => {
        const athleteName = getAthleteName(test.athlete_id).toLowerCase();
        return athleteName.includes(searchAthlete.toLowerCase());
      });
    }
    
    return filtered;
  }, [allTests, filterTestType, searchAthlete, getAthleteName]);

  // Función para formatear tipo de test con palabras más legibles
  const formatTestType = (test) => {
    if (test.test_type === "sprint_test") return "Test de Velocidad";
    if (test.test_type === "yoyo_test") return "Test Yoyo";
    if (test.test_type === "endurance_test") return "Test de Resistencia";
    if (test.test_type === "technical_assessment") return "Evaluación Técnica";
    return test.test_type?.replace(/_/g, " ") || "Test";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error al cargar la evaluación</p>
      </div>
    );
  }

  const tests = allTests || [];

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/seguimiento/evaluations")}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {evaluation.name}
          </h1>
          <p className="text-gray-600 text-sm">ID: {evaluation.id}</p>
        </div>
        <button
          onClick={() => navigate(`/seguimiento/evaluations/${id}/edit`)}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Edit2 size={20} />
          Editar
        </button>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de información */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Información
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Fecha</p>
              <p className="text-lg font-medium text-gray-900">
                {formatDate(evaluation.date)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hora</p>
              <p className="text-lg font-medium text-gray-900">
                {evaluation.time}
              </p>
            </div>
            {evaluation.location && (
              <div>
                <p className="text-sm text-gray-600">Ubicación</p>
                <p className="text-lg font-medium text-gray-900">
                  {evaluation.location}
                </p>
              </div>
            )}
            {evaluation.observations && (
              <div>
                <p className="text-sm text-gray-600">Observaciones</p>
                <p className="text-gray-900">{evaluation.observations}</p>
              </div>
            )}
          </div>
        </div>

        {/* Card de estado */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Activa
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tests Registrados</p>
              <p className="text-lg font-medium text-gray-900">
                {allTests.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Tests */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Tests Registrados
          </h2>
          <button
            onClick={() => navigate(`/seguimiento/evaluations/${id}/add-tests`)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            Agregar Test
          </button>
        </div>

        {/* Buscador de atleta */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">Buscar por nombre de atleta:</p>
          <input
            type="text"
            placeholder="Ingresa el nombre del atleta..."
            value={searchAthlete}
            onChange={(e) => setSearchAthlete(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filtro de tipo de test */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Filtrar por tipo:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterTestType("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterTestType === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterTestType("sprint_test")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterTestType === "sprint_test"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Test de Velocidad
            </button>
            <button
              onClick={() => setFilterTestType("yoyo_test")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterTestType === "yoyo_test"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Test Yoyo
            </button>
            <button
              onClick={() => setFilterTestType("endurance_test")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterTestType === "endurance_test"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Test de Resistencia
            </button>
            <button
              onClick={() => setFilterTestType("technical_assessment")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterTestType === "technical_assessment"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Evaluación Técnica
            </button>
          </div>
        </div>

        {testsLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              {allTests.length === 0
                ? "No hay tests registrados en esta evaluación"
                : "No hay tests de este tipo"}
            </p>
            {allTests.length === 0 && (
              <button
                onClick={() => navigate(`/seguimiento/evaluations/${id}/add-tests`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                Agregar primer test
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    {formatTestType(test)}
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
                    {getAthleteName(test.athlete_id)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Fecha: {formatDate(test.date)}
                </p>
                {test.observations && (
                  <p className="text-sm text-gray-600 mt-2">
                    Obs: {test.observations}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationDetail;
