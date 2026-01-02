/**
 * EvaluationsList Component
 *
 * Muestra una lista de evaluaciones con opciones
 * para ver detalles, editar y eliminar
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit2,
  Trash2,
  Eye,
  Plus,
  Filter,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useEvaluations,
  useDeleteEvaluation,
} from "../../hooks/useEvaluations";
import { formatDate } from "@/shared/utils/dateUtils";
import Button from "@/shared/components/Button";

const EvaluationsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");
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
      if (searchName.trim()) {
        if (!evaluation.name.toLowerCase().includes(searchName.toLowerCase())) {
          return false;
        }
      }
      if (filterDate) {
        const evaluationDate = evaluation.date.split("T")[0];
        if (evaluationDate !== filterDate) {
          return false;
        }
      }
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
  }, [data?.data, searchName, filterDate, filterLocation]);

  const totalFilteredCount = filteredEvaluations.length;
  const totalPages = Math.ceil(totalFilteredCount / pageSize);

  const paginatedEvaluations = filteredEvaluations.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  const hasActiveFilters = searchName || filterDate || filterLocation;

  React.useEffect(() => {
    setPage(0);
  }, [hasActiveFilters]);

  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro que desea eliminar esta evaluación?")) {
      deleteEvaluation.mutate(id);
    }
  };

  const handleClearFilters = () => {
    setSearchName("");
    setFilterDate("");
    setFilterLocation("");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className=" bg-slate-50 flex items-center justify-center">
        <div className="card bg-base-100 shadow-sm border border-base-300 p-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className=" bg-slate-50 p-6">
        <div className="alert alert-error">
          <span>Error al cargar evaluaciones</span>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="bg-primary/10 p-1.5 rounded-lg">
                <ClipboardList size={16} />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Módulo de Seguimiento
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Evaluaciones
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Gestiona las evaluaciones y tests de tus atletas.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/seguimiento/evaluations/create")}
            className="gap-2"
          >
            <Plus size={16} />
            Nueva Evaluación
          </Button>
        </div>

        {/* Filters Card */}
        <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={16} className="text-primary" />
              <span className="font-medium text-base-content text-sm">
                Filtros
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda por nombre */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs">Nombre</span>
                </label>
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="input input-bordered input-sm w-full bg-white"
                />
              </div>

              {/* Filtro por fecha */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs">Fecha</span>
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="input input-bordered input-sm w-full bg-white"
                />
              </div>

              {/* Búsqueda por ubicación */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs">Ubicación</span>
                </label>
                <input
                  type="text"
                  placeholder="Buscar por ubicación..."
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="input input-bordered input-sm w-full bg-white"
                />
              </div>
            </div>

            {/* Limpiar filtros */}
            {hasActiveFilters && (
              <div className="mt-4">
                <button
                  onClick={handleClearFilters}
                  className="btn btn-sm btn-ghost text-error hover:bg-error/10"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table Card */}
        <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-base-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pl-6">
                    Nombre
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                    Fecha
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                    Hora
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                    Ubicación
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pr-6">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200/60">
                {paginatedEvaluations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                          <ClipboardList size={32} className="text-primary" />
                        </div>
                        <p className="text-slate-500">
                          {hasActiveFilters
                            ? "No hay evaluaciones que coincidan con los filtros"
                            : "No hay evaluaciones disponibles"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedEvaluations.map((evaluation) => (
                    <tr
                      key={evaluation.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 pl-6">
                        <span className="font-semibold text-slate-900">
                          {evaluation.name}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-slate-600 text-sm">
                          {formatDate(evaluation.date)}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-slate-600 text-sm">
                          {evaluation.time}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-slate-600 text-sm">
                          {evaluation.location || "-"}
                        </span>
                      </td>
                      <td className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Ver detalles"
                          >
                            <button
                              onClick={() =>
                                navigate(
                                  `/seguimiento/evaluations/${evaluation.id}`
                                )
                              }
                              className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Editar"
                          >
                            <button
                              onClick={() =>
                                navigate(
                                  `/seguimiento/evaluations/${evaluation.id}/edit`
                                )
                              }
                              className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
                            >
                              <Edit2 size={18} />
                            </button>
                          </div>
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Eliminar"
                          >
                            <button
                              onClick={() => handleDelete(evaluation.id)}
                              disabled={deleteEvaluation.isPending}
                              className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 bg-base-100 px-4 py-3 rounded-xl border border-base-300">
            <div className="text-sm text-slate-500">
              Mostrando{" "}
              <span className="font-medium text-slate-900">
                {page * pageSize + 1}
              </span>{" "}
              a{" "}
              <span className="font-medium text-slate-900">
                {Math.min((page + 1) * pageSize, totalFilteredCount)}
              </span>{" "}
              de{" "}
              <span className="font-medium text-slate-900">
                {totalFilteredCount}
              </span>{" "}
              resultados
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-sm btn-ghost"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} />
                Anterior
              </button>
              <div className="join">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = page <= 2 ? i : page + i - 2;
                  if (pageNum >= totalPages || pageNum < 0) return null;
                  return (
                    <button
                      key={pageNum}
                      className={`join-item btn btn-sm ${
                        page === pageNum ? "btn-primary" : "btn-ghost"
                      }`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>
              <button
                className="btn btn-sm btn-ghost"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationsList;
