import React from "react";
import PropTypes from "prop-types";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Users,
  GraduationCap,
  Briefcase,
  UserCog,
} from "lucide-react";

/**
 * Componente de filtros para la página de asistencia.
 * Versión Compacta.
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
  // Configuración de tabs con iconos
  const tabs = [
    { id: "", label: "Todos", icon: Users },
    { id: "EXTERNOS", label: "Escuela", icon: Users },
    { id: "ESTUDIANTES", label: "Estudiantes", icon: GraduationCap },
    { id: "DOCENTES", label: "Docentes", icon: GraduationCap },
    { id: "TRABAJADORES", label: "Trabajadores", icon: Briefcase },
    { id: "ADMINISTRATIVOS", label: "Admin", icon: UserCog },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg shadow-slate-200/50 border border-white/50 p-4 mb-6 transition-all hover:shadow-slate-200/60">
      {/* Header del Filtro */}
      <div className="flex items-center gap-2 mb-4 text-slate-700">
        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
          <Filter size={16} />
        </div>
        <h3 className="font-bold text-sm">Filtros de Búsqueda</h3>
      </div>

      <div className="flex flex-col gap-4">
        {/* Fila 1: Inputs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Grupo Fecha y Hora (Combinados visualmente) */}
          <div className="md:col-span-4 flex rounded-lg overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-slate-50/50 h-10">
            <div className="flex-1 border-r border-slate-200 relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Calendar size={14} />
              </div>
              <input
                type="date"
                className="w-full pl-9 pr-2 py-2 bg-transparent border-none focus:outline-none text-xs font-medium text-slate-700 placeholder-slate-400 h-full"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
              />
            </div>
            <div className="w-1/3 relative group">
              <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-secondary transition-colors">
                <Clock size={14} />
              </div>
              <input
                type="time"
                className="w-full pl-8 pr-2 py-2 bg-transparent border-none focus:outline-none text-xs font-medium text-slate-700 placeholder-slate-400 h-full"
                value={time}
                onChange={(e) => onTimeChange(e.target.value)}
                placeholder="--:--"
              />
            </div>
          </div>

          {/* Buscador */}
          <div className="md:col-span-8 relative group h-10">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <Search size={16} />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-xs font-medium text-slate-700 placeholder-slate-400 h-full"
              placeholder="Buscar por nombre o número de cédula..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Fila 2: Tabs de Tipo (Segmented Control) */}
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
            Filtrar por Tipo
          </label>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = typeFilter === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTypeFilterChange(tab.id)}
                  className={`
                    relative group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border
                    ${
                      isActive
                        ? "bg-slate-800 text-white border-slate-800 shadow-sm transform scale-105"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }
                  `}
                >
                  <Icon
                    size={12}
                    className={
                      isActive
                        ? "text-primary-content"
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>
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
