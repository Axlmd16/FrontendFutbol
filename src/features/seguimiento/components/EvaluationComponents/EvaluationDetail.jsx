/**
 * EvaluationDetail Component
 *
 * Muestra los detalles de una evaluación
 * y permite agregar tests
 */

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Edit2,
  ArrowLeft,
  Plus,
  X,
  ClipboardList,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Activity,
} from "lucide-react";
import {
  useEvaluationById,
  useTestsByEvaluation,
  useUpdateSprintTest,
  useUpdateYoyoTest,
  useUpdateEnduranceTest,
  useUpdateTechnicalAssessment,
} from "../../hooks/useEvaluations";
import { useQuery } from "@tanstack/react-query";
import athletesApi from "../../services/athletes.api";
import { formatDate } from "@/shared/utils/dateUtils";
import EditTestForm from "../tests/EditTestForm";
import Button from "@/shared/components/Button";

const EvaluationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [filterTestType, setFilterTestType] = React.useState("all");
  const [searchAthlete, setSearchAthlete] = React.useState("");
  const [editingTest, setEditingTest] = React.useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // Hooks de mutación para actualizar tests
  const updateSprintTest = useUpdateSprintTest();
  const updateYoyoTest = useUpdateYoyoTest();
  const updateEnduranceTest = useUpdateEnduranceTest();
  const updateTechnicalAssessment = useUpdateTechnicalAssessment();

  const { data, isLoading, error } = useEvaluationById(id);
  const {
    data: testsData,
    isLoading: testsLoading,
    refetch: refetchTests,
  } = useTestsByEvaluation(id);

  const evaluation = data?.data;
  const allTests = testsData?.all || [];

  // Hook para obtener datos de atletas con caché
  const { data: athletesData } = useQuery({
    queryKey: ["athletes", "all"],
    queryFn: () => athletesApi.getAll({ page: 1, limit: 100 }),
    staleTime: 10 * 60 * 1000,
  });

  const athletes = React.useMemo(() => {
    if (!athletesData) return [];
    if (athletesData.items && Array.isArray(athletesData.items)) {
      return athletesData.items;
    }
    if (athletesData.data) {
      if (Array.isArray(athletesData.data)) {
        return athletesData.data;
      }
      if (athletesData.data.items && Array.isArray(athletesData.data.items)) {
        return athletesData.data.items;
      }
    }
    if (Array.isArray(athletesData)) {
      return athletesData;
    }
    return [];
  }, [athletesData]);

  const getAthleteName = React.useCallback(
    (athleteId) => {
      if (!athletes || athletes.length === 0) {
        return `Atleta ${athleteId}`;
      }
      const athlete = athletes.find((a) => a.id === athleteId);
      if (!athlete) {
        return `Atleta ${athleteId}`;
      }
      if (athlete.full_name) {
        return athlete.full_name;
      }
      const firstName = athlete.first_name || athlete.firstName || "";
      const lastName = athlete.last_name || athlete.lastName || "";
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      }
      return firstName || lastName || `Atleta ${athleteId}`;
    },
    [athletes]
  );

  // Filtrar tests
  const filteredTests = React.useMemo(() => {
    let filtered = allTests;
    if (filterTestType !== "all") {
      filtered = filtered.filter((test) => test.test_type === filterTestType);
    }
    if (searchAthlete.trim()) {
      filtered = filtered.filter((test) => {
        const athleteName = getAthleteName(test.athlete_id).toLowerCase();
        return athleteName.includes(searchAthlete.toLowerCase());
      });
    }
    return filtered;
  }, [allTests, filterTestType, searchAthlete, getAthleteName]);

  const formatTestType = (test) => {
    const types = {
      sprint_test: "Test de Velocidad",
      yoyo_test: "Test Yoyo",
      endurance_test: "Test de Resistencia",
      technical_assessment: "Evaluación Técnica",
    };
    return (
      types[test.test_type] || test.test_type?.replace(/_/g, " ") || "Test"
    );
  };

  const getTestTypeColor = (testType) => {
    const colors = {
      sprint_test: "badge-info",
      yoyo_test: "badge-success",
      endurance_test: "badge-warning",
      technical_assessment: "badge-secondary",
    };
    return colors[testType] || "badge-neutral";
  };

  const handleEditTest = (test) => {
    const freshTest = allTests.find((t) => t.id === test.id) || test;
    setEditingTest(freshTest);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTest(null);
  };

  const getUpdateMutation = (testType) => {
    switch (testType) {
      case "sprint_test":
        return updateSprintTest;
      case "yoyo_test":
        return updateYoyoTest;
      case "endurance_test":
        return updateEnduranceTest;
      case "technical_assessment":
        return updateTechnicalAssessment;
      default:
        return null;
    }
  };

  const testTypeFilters = [
    { id: "all", label: "Todos" },
    { id: "sprint_test", label: "Velocidad" },
    { id: "yoyo_test", label: "Yoyo" },
    { id: "endurance_test", label: "Resistencia" },
    { id: "technical_assessment", label: "Técnica" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="card bg-base-100 shadow-sm border border-base-300 p-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !evaluation) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="alert alert-error">
            <span>Error al cargar la evaluación</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Back button */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        <button
          onClick={() => navigate("/seguimiento/evaluations")}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 mb-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Volver a evaluaciones
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="bg-primary/10 p-1.5 rounded-lg">
                <ClipboardList size={16} />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Detalle de Evaluación
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {evaluation.name}
            </h1>
            <p className="text-slate-500 mt-1 text-sm">ID: {evaluation.id}</p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/seguimiento/evaluations/${id}/edit`)}
            className="gap-2"
          >
            <Edit2 size={16} />
            Editar Evaluación
          </Button>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Fecha */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Fecha
                  </p>
                  <p className="font-semibold text-slate-900">
                    {formatDate(evaluation.date)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hora */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="bg-info/10 p-2 rounded-lg">
                  <Clock size={20} className="text-info" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Hora
                  </p>
                  <p className="font-semibold text-slate-900">
                    {evaluation.time}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="bg-warning/10 p-2 rounded-lg">
                  <MapPin size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Ubicación
                  </p>
                  <p className="font-semibold text-slate-900">
                    {evaluation.location || "Sin especificar"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tests Count */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="bg-success/10 p-2 rounded-lg">
                  <Activity size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Tests
                  </p>
                  <p className="font-semibold text-slate-900">
                    {allTests.length} registrados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Observations */}
        {evaluation.observations && (
          <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
            <div className="card-body p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-primary" />
                <span className="font-medium text-sm">Observaciones</span>
              </div>
              <p className="text-slate-600 text-sm">
                {evaluation.observations}
              </p>
            </div>
          </div>
        )}

        {/* Tests Section */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h2 className="font-semibold text-lg text-slate-900">
                Tests Registrados
              </h2>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  navigate(`/seguimiento/evaluations/${id}/add-tests`)
                }
                className="gap-2"
              >
                <Plus size={16} />
                Agregar Test
              </Button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre de atleta..."
                value={searchAthlete}
                onChange={(e) => setSearchAthlete(e.target.value)}
                className="input input-bordered input-sm w-full md:w-80 bg-white"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {testTypeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterTestType(filter.id)}
                  className={`btn btn-sm ${
                    filterTestType === filter.id
                      ? "btn-primary"
                      : "btn-ghost border border-base-300"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Tests Grid */}
            {testsLoading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-md text-primary"></span>
              </div>
            ) : filteredTests.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-primary/10 p-4 rounded-full inline-block mb-4">
                  <Activity size={32} className="text-primary" />
                </div>
                <p className="text-slate-500">
                  {allTests.length === 0
                    ? "No hay tests registrados en esta evaluación"
                    : "No hay tests que coincidan con los filtros"}
                </p>
                {allTests.length === 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/seguimiento/evaluations/${id}/add-tests`)
                    }
                    className="mt-4"
                  >
                    Agregar primer test
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTests.map((test) => (
                  <div
                    key={test.id}
                    className="border border-base-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className={`badge ${getTestTypeColor(
                          test.test_type
                        )} badge-sm`}
                      >
                        {formatTestType(test)}
                      </span>
                      <button
                        onClick={() => handleEditTest(test)}
                        className="btn btn-ghost btn-xs btn-square text-primary hover:bg-primary/10"
                        title="Editar test"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm mb-1">
                      {getAthleteName(test.athlete_id)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(test.date)}
                    </p>
                    {test.observations && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                        {test.observations}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingTest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card bg-base-100 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title">
                  Editar {formatTestType(editingTest)}
                </h2>
                <button
                  onClick={handleCloseEditModal}
                  className="btn btn-ghost btn-sm btn-square"
                >
                  <X size={20} />
                </button>
              </div>

              <EditTestForm
                test={editingTest}
                mutation={getUpdateMutation(editingTest.test_type)}
                onSuccess={() => {
                  refetchTests();
                  handleCloseEditModal();
                }}
                onCancel={handleCloseEditModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationDetail;
