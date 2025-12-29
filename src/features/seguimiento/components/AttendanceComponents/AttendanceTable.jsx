import React from "react";
import PropTypes from "prop-types";
import { CheckCircle, XCircle, Users } from "lucide-react";

/**
 * Tabla de asistencia con toggles para marcar presente/ausente
 * y campo de justificación.
 */
function AttendanceTable({
  athletes = [],
  attendanceData = {},
  onToggleAttendance,
  onJustificationChange,
  onMarkAllPresent,
  loading = false,
}) {
  // Obtener el tipo de atleta formateado para mostrar
  const formatAthleteType = (type) => {
    const types = {
      EXTERNOS: { label: "Escuela", class: "badge-primary" },
      ESTUDIANTES: { label: "Estudiante", class: "badge-secondary" },
      DOCENTES: { label: "Docente", class: "badge-accent" },
      TRABAJADORES: { label: "Trabajador", class: "badge-info" },
      ADMINISTRATIVOS: { label: "Administrativo", class: "badge-warning" },
    };
    return types[type] || { label: type, class: "badge-ghost" };
  };

  // Contar presentes y ausentes
  const presentCount = Object.values(attendanceData).filter(
    (a) => a.is_present
  ).length;
  const totalCount = athletes.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (athletes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Users size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium">No hay atletas para mostrar</p>
        <p className="text-sm">
          Selecciona una fecha o ajusta los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
      {/* Header con estadísticas y acciones */}
      <div className="px-6 py-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-base-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Estadísticas */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-success" size={20} />
              <span className="font-semibold text-success">{presentCount}</span>
              <span className="text-gray-600">Presentes</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="text-error" size={20} />
              <span className="font-semibold text-error">
                {totalCount - presentCount}
              </span>
              <span className="text-gray-600">Ausentes</span>
            </div>
            <div className="text-sm text-gray-500">
              Total: <span className="font-semibold">{totalCount}</span>
            </div>
          </div>

          {/* Botón marcar todos */}
          <button
            type="button"
            className="btn btn-sm btn-primary btn-outline gap-2"
            onClick={onMarkAllPresent}
          >
            <CheckCircle size={16} />
            Marcar todos presentes
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200">
              <th className="w-12 text-center">#</th>
              <th>Atleta</th>
              <th className="w-32">Tipo</th>
              <th className="w-40 text-center">Asistencia</th>
              <th className="min-w-[200px]">Justificación</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete, index) => {
              const attendance = attendanceData[athlete.id] || {
                is_present: true,
                justification: "",
              };
              const typeInfo = formatAthleteType(athlete.type_athlete);

              return (
                <tr
                  key={athlete.id}
                  className={`hover ${
                    !attendance.is_present ? "bg-error/5" : ""
                  }`}
                >
                  {/* Número */}
                  <td className="text-center text-gray-500 font-mono">
                    {index + 1}
                  </td>

                  {/* Info del atleta */}
                  <td>
                    <div className="flex items-center gap-3">
                      {/* Avatar placeholder con iniciales */}
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10 h-10">
                          <span className="text-sm font-medium">
                            {athlete.full_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {athlete.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          CI: {athlete.dni}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tipo de atleta */}
                  <td>
                    <span className={`badge ${typeInfo.class} badge-sm`}>
                      {typeInfo.label}
                    </span>
                  </td>

                  {/* Toggle de asistencia */}
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className={`text-xs font-medium ${
                          attendance.is_present ? "text-gray-400" : "text-error"
                        }`}
                      >
                        Ausente
                      </span>
                      <input
                        type="checkbox"
                        className="toggle toggle-success toggle-md"
                        checked={attendance.is_present}
                        onChange={() =>
                          onToggleAttendance(athlete.id, !attendance.is_present)
                        }
                      />
                      <span
                        className={`text-xs font-medium ${
                          attendance.is_present
                            ? "text-success"
                            : "text-gray-400"
                        }`}
                      >
                        Presente
                      </span>
                    </div>
                  </td>

                  {/* Justificación */}
                  <td>
                    <input
                      type="text"
                      className={`input input-bordered input-sm w-full ${
                        attendance.is_present
                          ? "bg-base-200 cursor-not-allowed opacity-50"
                          : "bg-white"
                      }`}
                      placeholder={
                        attendance.is_present ? "—" : "Motivo de la ausencia..."
                      }
                      value={attendance.justification || ""}
                      onChange={(e) =>
                        onJustificationChange(athlete.id, e.target.value)
                      }
                      disabled={attendance.is_present}
                      maxLength={500}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

AttendanceTable.propTypes = {
  athletes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      full_name: PropTypes.string.isRequired,
      dni: PropTypes.string.isRequired,
      type_athlete: PropTypes.string,
    })
  ),
  attendanceData: PropTypes.object,
  onToggleAttendance: PropTypes.func.isRequired,
  onJustificationChange: PropTypes.func.isRequired,
  onMarkAllPresent: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default AttendanceTable;
