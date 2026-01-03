/**
 * Componente de Filtros para Reportes
 * 
 * Permite seleccionar criterios de filtrado para generar reportes personalizados.
 */

import { useState } from "react";
import Select from "@/shared/components/Select";
import Button from "@/shared/components/Button";
import { Filter, X } from "lucide-react";
import { SPORT_CATEGORIES } from "@/app/config/constants";

const ReportsFilters = ({ athletes = [], onFilter, isLoading = false }) => {
  const [filters, setFilters] = useState({
    category: "",
    athlete_id: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: "",
      athlete_id: "",
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Filter size={20} />
        Filtros de Reporte
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Categoría */}
        <div>
          <Select
            label="Categoría (Opcional)"
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            disabled={isLoading}
          >
            <option value="">Todas las categorías</option>
            {SPORT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Deportista */}
        <div>
          <Select
            label="Deportista (Opcional)"
            value={filters.athlete_id}
            onChange={(e) => handleFilterChange("athlete_id", e.target.value)}
            disabled={isLoading}
          >
            <option value="">Todos los deportistas</option>
            {athletes.map((athlete) => (
              <option key={athlete.id} value={athlete.id}>
                {athlete.full_name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          onClick={handleClearFilters}
          variant="secondary"
          disabled={isLoading}
        >
          <X size={16} />
          Limpiar
        </Button>
        <Button
          onClick={handleApplyFilters}
          variant="primary"
          disabled={isLoading}
        >
          <Filter size={16} />
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};

export default ReportsFilters;
