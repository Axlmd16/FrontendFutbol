import React from "react";
import PropTypes from "prop-types";
import { CheckCircle, XCircle, Users, AlertCircle, Info } from "lucide-react";

/**
 * Tabla de asistencia modernizada con estilo Dashboard.
 * Versión Compacta.
 */
function AttendanceTable({
  athletes = [],
  attendanceData = {},
  onToggleAttendance,
  onJustificationChange,
  onMarkAllPresent,
  loading = false,
}) {
  // Configuración de tipos con colores semánticos
  const formatAthleteType = (type) => {
    const types = {
      EXTERNOS: {
        label: "Escuela",
        class: "bg-blue-100 text-blue-700 border-blue-200",
      },
      ESTUDIANTES: {
        label: "Estudiante",
        class: "bg-purple-100 text-purple-700 border-purple-200",
      },
      DOCENTES: {
        label: "Docente",
        class: "bg-emerald-100 text-emerald-700 border-emerald-200",
      },
      TRABAJADORES: {
        label: "Trabajador",
        class: "bg-orange-100 text-orange-700 border-orange-200",
      },
      ADMINISTRATIVOS: {
        label: "Admin",
        class: "bg-slate-100 text-slate-700 border-slate-200",
      },
    };
    return types[type] || { label: type, class: "badge-ghost" };
  };

  // Contar presentes y ausentes
  const presentCount = Object.values(attendanceData).filter(
    (a) => a.is_present
  ).length;
  const totalCount = athletes.length;
  const absentCount = totalCount - presentCount;
  const attendancePercentage =
    totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
        <span className="loading loading-spinner loading-md text-primary mb-2"></span>
        <span className="text-slate-400 text-sm font-medium animate-pulse">
          Cargando...
        </span>
      </div>
    );
  }

  if (athletes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-slate-100 text-center">
        <div className="bg-slate-50 p-4 rounded-full rotate-12 mb-4">
          <Users size={32} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-1">
          No hay atletas listados
        </h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          Cambia la fecha o filtros para ver resultados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Dashboard Stats */}

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Table Header Actions */}
        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-base text-slate-700">
            Listado de Atletas
          </h3>
          <button
            type="button"
            className="btn btn-xs btn-ghost hover:bg-emerald-50 text-emerald-600 normal-case font-medium"
            onClick={onMarkAllPresent}
          >
            <CheckCircle size={14} />
            Marcar todos
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 text-[10px] uppercase tracking-wider font-semibold border-b border-slate-100">
                <th className="px-4 py-3 w-10 text-center">#</th>
                <th className="px-4 py-3">Atleta</th>
                <th className="px-4 py-3 w-32">Tipo</th>
                <th className="px-4 py-3 text-center w-40">Estado</th>
                <th className="px-4 py-3 min-w-[200px]">Justificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {athletes.map((athlete, index) => {
                const attendance = attendanceData[athlete.id] || {
                  is_present: false,
                  justification: "",
                };
                const typeInfo = formatAthleteType(athlete.type_athlete);
                const isPresent = attendance.is_present;
                const isJustified =
                  !isPresent &&
                  attendance.justification &&
                  attendance.justification.trim() !== "";

                return (
                  <tr
                    key={athlete.id}
                    className={`group transition-colors duration-200 ${
                      isPresent
                        ? "hover:bg-slate-50"
                        : isJustified
                        ? "bg-rose-50/40 hover:bg-rose-50/70"
                        : "bg-slate-50/50 hover:bg-slate-100"
                    }`}
                  >
                    {/* Index */}
                    <td className="px-4 py-3 text-center text-slate-300 font-mono text-[10px]">
                      {index + 1}
                    </td>

                    {/* Atleta */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                            isPresent
                              ? "bg-linear-to-br from-primary to-primary-focus"
                              : "bg-slate-300"
                          }`}
                        >
                          {athlete.full_name?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div
                            className={`font-semibold text-sm leading-tight ${
                              isPresent ? "text-slate-800" : "text-slate-600"
                            }`}
                          >
                            {athlete.full_name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {athlete.dni}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Tipo */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${typeInfo.class}`}
                      >
                        {typeInfo.label}
                      </span>
                    </td>

                    {/* Estado Switch */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          onToggleAttendance(athlete.id, !isPresent)
                        }
                        className={`
                                relative inline-flex h-7 w-28 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 scale-95
                                ${
                                  isPresent
                                    ? "bg-emerald-500 focus:ring-emerald-500"
                                    : isJustified
                                    ? "bg-rose-500 focus:ring-rose-500"
                                    : "bg-slate-200 focus:ring-slate-300"
                                }
                            `}
                      >
                        <span
                          className={`
                                absolute left-1 flex h-5 w-5 transform items-center justify-center rounded-full bg-white transition-transform duration-300
                                ${
                                  isPresent ? "translate-x-21" : "translate-x-0"
                                }
                             `}
                        >
                          {isPresent ? (
                            <CheckCircle
                              size={12}
                              className="text-emerald-500"
                            />
                          ) : isJustified ? (
                            <AlertCircle size={12} className="text-rose-500" />
                          ) : (
                            <XCircle size={12} className="text-slate-400" />
                          )}
                        </span>
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold uppercase text-white tracking-wider pointer-events-none">
                          {isPresent ? (
                            "Presente"
                          ) : isJustified ? (
                            "Justificado"
                          ) : (
                            <span className="text-slate-500">Sin Reg.</span>
                          )}
                        </span>
                      </button>
                    </td>

                    {/* Justificación */}
                    <td className="px-4 py-3">
                      <div
                        className={`transition-opacity duration-300 ${
                          isPresent ? "opacity-30 grayscale" : "opacity-100"
                        }`}
                      >
                        <div className="relative">
                          <input
                            type="text"
                            className={`
                                        w-full bg-transparent border-b text-xs py-1 px-0 focus:outline-none transition-colors placeholder-slate-300
                                        ${
                                          isPresent
                                            ? "border-transparent cursor-not-allowed"
                                            : "border-slate-200 focus:border-rose-400"
                                        }
                                    `}
                            placeholder={
                              isPresent ? "" : "Escribe el motivo..."
                            }
                            value={attendance.justification || ""}
                            onChange={(e) =>
                              onJustificationChange(athlete.id, e.target.value)
                            }
                            disabled={isPresent}
                          />
                          {!isPresent && !attendance.justification && (
                            <AlertCircle
                              size={12}
                              className="absolute right-0 top-1.5 text-rose-300 animate-pulse pointer-events-none"
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
