import React, { useState, useEffect, useCallback } from "react";
import { Users, Loader, ChevronDown, ChevronUp, Search } from "lucide-react";
import useDebounce from "@/shared/hooks/useDebounce";
import athletesApi from "../../services/athletes.api";

/**
 * Componente para seleccionar atletas de una lista
 * Reutilizable en todos los formularios de test
 */
function AthletesSelectionList({
  selectedAthleteIds = [],
  onSelectionChange,
  multiSelect = false, // for backward compatibility, but we enforce single select
  loading: parentLoading = false,
  onSelectedAthleteChange = () => {},
}) {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Cargar atletas
  const fetchAthletes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        type_athlete: typeFilter || undefined,
      };

      const response = await athletesApi.getAll(params);

      if (response.status === "success" && response.data) {
        setAthletes(response.data.items || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
        }));
      }
    } catch (error) {
      console.error("Error al cargar atletas:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, typeFilter]);

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  // Manejar selección
  const handleToggleAthlete = (athleteId) => {
    // Forzado a single select: si está seleccionado se desmarca, si no, se reemplaza.
    const newSelection = selectedAthleteIds.includes(athleteId)
      ? []
      : [athleteId];

    onSelectionChange(newSelection);

    // Notificar atleta(s) seleccionado(s) (útil para modo single select)
    if (onSelectedAthleteChange) {
      if (!multiSelect) {
        const selectedAthlete =
          newSelection.length === 1
            ? athletes.find((a) => a.id === newSelection[0]) || null
            : null;
        onSelectedAthleteChange(selectedAthlete);
      } else {
        const selectedList = athletes.filter((a) =>
          newSelection.includes(a.id)
        );
        onSelectedAthleteChange(selectedList);
      }
    }
  };

  // Tipos de atleta
  const formatAthleteType = (type) => {
    const types = {
      EXTERNOS: {
        label: "Escuela",
        class: "bg-blue-100 text-blue-700",
      },
      ESTUDIANTES: {
        label: "Estudiante",
        class: "bg-purple-100 text-purple-700",
      },
      DOCENTES: {
        label: "Docente",
        class: "bg-emerald-100 text-emerald-700",
      },
      TRABAJADORES: {
        label: "Trabajador",
        class: "bg-orange-100 text-orange-700",
      },
      ADMINISTRATIVOS: {
        label: "Admin",
        class: "bg-slate-100 text-slate-700",
      },
    };
    return types[type] || { label: type, class: "bg-gray-100 text-gray-700" };
  };

  const isSelected = (athleteId) => selectedAthleteIds.includes(athleteId);
  const selectedCount = selectedAthleteIds.length;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Seleccionar Atletas
            </h3>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
            {selectedCount} seleccionado{selectedCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o club..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Filtros (expandible) */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => setExpandedFilters(!expandedFilters)}
          className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-semibold text-gray-700">Filtros</span>
          {expandedFilters ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {expandedFilters && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-wrap gap-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Todos los tipos</option>
                <option value="EXTERNOS">Escuela</option>
                <option value="ESTUDIANTES">Estudiante</option>
                <option value="DOCENTES">Docente</option>
                <option value="TRABAJADORES">Trabajador</option>
                <option value="ADMINISTRATIVOS">Admin</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Lista de atletas */}
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {loading || parentLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
        ) : athletes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Users className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No se encontraron atletas</p>
          </div>
        ) : (
          athletes.map((athlete) => {
            const selected = isSelected(athlete.id);
            const typeInfo = formatAthleteType(athlete.type_athlete);

            return (
              <div
                key={athlete.id}
                onClick={() => handleToggleAthlete(athlete.id)}
                className={`px-6 py-4 cursor-pointer transition-all duration-200 ${
                  selected
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox visual */}
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      selected
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {selected && (
                      <svg
                        className="w-3 h-3 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Datos del atleta */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {athlete.full_name}
                      </p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${typeInfo.class}`}>
                        {typeInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {athlete.club && (
                        <>
                          <span className="truncate">{athlete.club}</span>
                          <span>•</span>
                        </>
                      )}
                      {athlete.dni && <span>DNI: {athlete.dni}</span>}
                      {!athlete.dni && !athlete.club && <span>Sin DNI</span>}
                    </div>
                  </div>

                  {/* Indicador de selección */}
                  {selected && (
                    <div className="flex-shrink-0 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                      ✓
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resumen */}
      {athletes.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
          Mostrando {athletes.length} de {pagination.total} atletas
        </div>
      )}
    </div>
  );
}

export default AthletesSelectionList;
