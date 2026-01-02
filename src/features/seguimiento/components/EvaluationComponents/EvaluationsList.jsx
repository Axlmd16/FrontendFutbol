/**
 * EvaluationsList Component
 *
 * Muestra una lista de evaluaciones con opciones
 * para ver detalles, editar y eliminar
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Eye, Plus, X } from "lucide-react";
import {
  useEvaluations,
  useDeleteEvaluation,
} from "../../hooks/useEvaluations";
import { formatDate, formatTime } from "@/shared/utils/dateUtils";

const EvaluationsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const pageSize = 10;

  const { data, isLoading, error } = useEvaluations({
    skip: page * pageSize,
    limit: pageSize,
  });

  const deleteEvaluation = useDeleteEvaluation();

  // Aplicar filtros a las evaluaciones
  const filteredEvaluations = useMemo(() => {
    const evaluations = data?.data || [];
    return evaluations.filter((evaluation) => {
      // Filtro por nombre (case-insensitive substring)
      if (searchName.trim()) {
        if (!evaluation.name.toLowerCase().includes(searchName.toLowerCase())) {
          return false;
        }
      }
      // Filtro por fecha
      if (filterDate) {
        const evaluationDate = evaluation.date.split("T")[0];
        if (evaluationDate !== filterDate) {
          return false;
        }
      }
      // Filtro por hora
      if (filterTime) {
        if (evaluation.time !== filterTime) {
          return false;
        }
      }
      // Filtro por ubicación (case-insensitive substring)
      if (filterLocation.trim()) {
        if (
          !evaluation.location
            ?.toLowerCase()
            .includes(filterLocation.toLowerCase())
        ) {
          return false;
        }
      }
      return true;
    });
  }, [data?.data, searchName, filterDate, filterTime, filterLocation]);

  // Calcular total de páginas basado en evaluaciones filtradas
  const totalFilteredCount = filteredEvaluations.length;
  const totalPages = Math.ceil(totalFilteredCount / pageSize);

  // Obtener evaluaciones para la página actual
  const paginatedEvaluations = filteredEvaluations.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  // Resetear página si hay filtros activos
  const hasActiveFilters =
    searchName || filterDate || filterTime || filterLocation;
  React.useEffect(() => {
    setPage(0);
  }, [hasActiveFilters]);

  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro que desea eliminar esta evaluación?")) {
      deleteEvaluation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error al cargar evaluaciones</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botón para crear evaluación */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Evaluaciones</h2>
        <button
          onClick={() => navigate("/seguimiento/evaluations/create")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          Nueva Evaluación
        </button>
      </div>

      {/* Filtros de búsqueda */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
        <h3 className="font-semibold text-gray-900">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda por nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filtro por fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filtro por hora */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora
            </label>
            <input
              type="time"
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Búsqueda por ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              placeholder="Buscar por ubicación..."
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Botón para limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearchName("");
              setFilterDate("");
              setFilterTime("");
              setFilterLocation("");
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={16} />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla de evaluaciones */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Hora
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Ubicación
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedEvaluations.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  {hasActiveFilters
                    ? "No hay evaluaciones que coincidan con los filtros"
                    : "No hay evaluaciones disponibles"}
                </td>
              </tr>
            ) : (
              paginatedEvaluations.map((evaluation) => (
                <tr key={evaluation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {evaluation.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(evaluation.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {evaluation.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {evaluation.location || "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/seguimiento/evaluations/${evaluation.id}`)
                        }
                        className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/seguimiento/evaluations/${evaluation.id}/edit`
                          )
                        }
                        className="text-amber-600 hover:text-amber-900 p-2 rounded hover:bg-amber-50 transition"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(evaluation.id)}
                        disabled={deleteEvaluation.isPending}
                        className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition disabled:opacity-50"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-4 py-2 rounded-lg ${
                page === i
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default EvaluationsList;
