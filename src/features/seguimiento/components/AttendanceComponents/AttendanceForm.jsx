import React from "react";
import PropTypes from "prop-types";
import { Calendar, Clock, Search, Filter } from "lucide-react";
import { TYPE_STAMENT_OPTIONS } from "@/app/config/constants";

/**
 * Componente de filtros para la página de asistencia.
 * Incluye selector de fecha, hora, tipo de atleta y búsqueda.
 */
function AttendanceForm({
  date,
  time,
  typeFilter,
  searchTerm,
  onDateChange,
  onTimeChange,
  onTypeFilterChange,
  onSearchChange,
}) {
  // Opciones de tipo de atleta con "Todos" y agrupación
  const typeOptions = [
    { value: "", label: "Todos los tipos" },
    { value: "EXTERNOS", label: "🏫 Escuela (Externos)" },
    { value: "ESTUDIANTES", label: "📚 Estudiantes UNL" },
    { value: "DOCENTES", label: "👨‍🏫 Docentes UNL" },
    { value: "TRABAJADORES", label: "👷 Trabajadores UNL" },
    { value: "ADMINISTRATIVOS", label: "💼 Administrativos UNL" },
  ];

  return (
    <div className="bg-base-100 rounded-xl shadow-lg p-6 mb-6">
      {/* Título de sección */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="text-primary" size={20} />
        <h3 className="font-semibold text-gray-800">Filtros de Asistencia</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Selector de fecha */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              Fecha
            </span>
          </label>
          <input
            type="date"
            className="input input-bordered input-primary w-full"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        {/* Selector de hora (opcional) */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium flex items-center gap-2">
              <Clock size={16} className="text-secondary" />
              Hora (opcional)
            </span>
          </label>
          <input
            type="time"
            className="input input-bordered input-secondary w-full"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            placeholder="00:00"
          />
          <label className="label">
            <span className="label-text-alt text-gray-500">
              Si no ingresa, se usa la hora actual
            </span>
          </label>
        </div>

        {/* Filtro por tipo de atleta */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Tipo de Atleta</span>
          </label>
          <select
            className="select select-bordered select-primary w-full"
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Búsqueda */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium flex items-center gap-2">
              <Search size={16} className="text-accent" />
              Buscar
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered input-accent w-full"
            placeholder="Nombre o cédula..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs rápidos de tipos */}
      <div className="mt-4 pt-4 border-t border-base-200">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`btn btn-sm ${
              typeFilter === "" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => onTypeFilterChange("")}
          >
            Todos
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              typeFilter === "EXTERNOS" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => onTypeFilterChange("EXTERNOS")}
          >
            🏫 Escuela
          </button>
          <div className="divider divider-horizontal m-0"></div>
          <button
            type="button"
            className={`btn btn-sm ${
              typeFilter === "ESTUDIANTES" ? "btn-secondary" : "btn-ghost"
            }`}
            onClick={() => onTypeFilterChange("ESTUDIANTES")}
          >
            📚 Estudiantes
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              typeFilter === "DOCENTES" ? "btn-secondary" : "btn-ghost"
            }`}
            onClick={() => onTypeFilterChange("DOCENTES")}
          >
            👨‍🏫 Docentes
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              typeFilter === "TRABAJADORES" ? "btn-secondary" : "btn-ghost"
            }`}
            onClick={() => onTypeFilterChange("TRABAJADORES")}
          >
            👷 Trabajadores
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              typeFilter === "ADMINISTRATIVOS" ? "btn-secondary" : "btn-ghost"
            }`}
            onClick={() => onTypeFilterChange("ADMINISTRATIVOS")}
          >
            💼 Administrativos
          </button>
        </div>
      </div>
    </div>
  );
}

AttendanceForm.propTypes = {
  date: PropTypes.string.isRequired,
  time: PropTypes.string,
  typeFilter: PropTypes.string,
  searchTerm: PropTypes.string,
  onDateChange: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onTypeFilterChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default AttendanceForm;
