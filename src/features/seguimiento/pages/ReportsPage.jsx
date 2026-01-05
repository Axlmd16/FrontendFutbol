/**
 * Página de Reportes Deportivos - Diseño Compacto
 *
 * Interfaz compacta en una sola vista sin scroll.
 */

import { useEffect, useState } from "react";
import DateRangePicker from "@/features/seguimiento/components/DateRangePicker";
import GenerateReportButton from "@/features/seguimiento/components/GenerateReportButton";
import useReports from "@/features/seguimiento/hooks/useReports";
import athletesApi from "@/features/athletes/services/athletes.api";
import Loader from "@/shared/components/Loader";
import {
  ClipboardList,
  Activity,
  BarChart3,
  FileText,
  FileSpreadsheet,
  Table,
  FileBarChart,
} from "lucide-react";
import { ESTAMENTO_FILTER_OPTIONS } from "@/app/config/constants";

const REPORT_TYPES = [
  {
    value: "attendance",
    label: "Asistencia",
    icon: ClipboardList,
  },
  {
    value: "tests",
    label: "Evaluaciones",
    icon: Activity,
  },
  {
    value: "statistics",
    label: "Estadísticas",
    icon: BarChart3,
  },
];

const EXPORT_FORMATS = [
  { value: "pdf", label: "PDF", icon: FileText },
  { value: "csv", label: "CSV", icon: Table },
  { value: "xlsx", label: "XLSX", icon: FileSpreadsheet },
];

const ReportsPage = () => {
  const { isLoading, error, generateAndDownloadReport, clearError } =
    useReports();

  const [selectedType, setSelectedType] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [athletes, setAthletes] = useState([]);
  const [athletesLoading, setAthletesLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    athlete_id: "",
    start_date: "",
    end_date: "",
  });

  // Cargar lista de deportistas
  useEffect(() => {
    const loadAthletes = async () => {
      setAthletesLoading(true);
      try {
        const response = await athletesApi.getAll({
          page: 1,
          limit: 100,
          is_active: true,
        });
        setAthletes(response.data?.items || []);
      } catch (err) {
        console.error("Error cargando deportistas:", err);
      } finally {
        setAthletesLoading(false);
      }
    };

    loadAthletes();
  }, []);

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field]: value,
    };

    if (field === "category") {
      newFilters.athlete_id = "";
    }

    setFilters(newFilters);
    clearError();
  };

  const handleApplyDateRange = (dateRange) => {
    setFilters((prev) => ({
      ...prev,
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
    }));
    clearError();
  };

  const handleGenerateReport = async () => {
    const backendFilters = {};

    if (filters.category) {
      backendFilters.athlete_type = filters.category;
    }
    if (filters.athlete_id && filters.athlete_id !== "") {
      const athleteIdNum = parseInt(filters.athlete_id, 10);
      if (!isNaN(athleteIdNum)) {
        backendFilters.athlete_id = athleteIdNum;
      }
    }
    if (filters.start_date) {
      backendFilters.start_date = filters.start_date;
    }
    if (filters.end_date) {
      backendFilters.end_date = filters.end_date;
    }

    console.log(
      "[ReportsPage] Generating report with filters:",
      backendFilters
    );

    await generateAndDownloadReport(
      selectedType,
      selectedFormat,
      backendFilters
    );
  };

  const filteredAthletes =
    filters.category === ""
      ? athletes
      : athletes.filter((athlete) => athlete.type_athlete === filters.category);

  if (athletesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-base-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Header Minimalista */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 p-2.5 rounded-lg">
            <FileBarChart className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-base-content">
              Generador de Reportes Deportivos
            </h1>
            <p className="text-sm text-base-content/60">
              Configura y descarga reportes en formato profesional
            </p>
          </div>
        </div>

        {/* Contenedor Principal - Todo en una vista */}
        <div className="bg-white rounded-xl shadow-lg border border-base-300 p-6">
          {/* Sección 1: Tipo de Reporte - Tabs Horizontales */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-base-content mb-2">
              Tipo de Reporte
            </label>
            <div className="flex gap-2">
              {REPORT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-content shadow-md"
                        : "bg-base-200 text-base-content/70 hover:bg-base-300"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sección 2: Filtros - Layout Horizontal */}
          <div className="mb-5 pb-5 border-b border-base-300">
            <label className="block text-sm font-semibold text-base-content mb-2">
              Filtros Opcionales
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Tipo de Atleta */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs">Tipo de Atleta</span>
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  disabled={isLoading}
                  className="select select-bordered select-sm w-full"
                >
                  {ESTAMENTO_FILTER_OPTIONS.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deportista Específico */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs">
                    Deportista Específico
                  </span>
                </label>
                <select
                  value={filters.athlete_id}
                  onChange={(e) =>
                    handleFilterChange("athlete_id", e.target.value)
                  }
                  disabled={isLoading || filteredAthletes.length === 0}
                  className="select select-bordered select-sm w-full"
                >
                  <option value="">Todos los deportistas</option>
                  {filteredAthletes.map((athlete) => (
                    <option key={athlete.id} value={athlete.id}>
                      {athlete.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rango de Fechas - Solo para attendance y tests */}
            {selectedType &&
              (selectedType === "attendance" || selectedType === "tests") && (
                <div className="mt-4">
                  <DateRangePicker
                    onDateRangeChange={handleApplyDateRange}
                    disabled={isLoading}
                  />
                </div>
              )}
          </div>

          {/* Sección 3: Formato de Exportación - Pills Compactos */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-base-content mb-2">
              Formato de Exportación
            </label>
            <div className="flex gap-3">
              {EXPORT_FORMATS.map((format) => {
                const Icon = format.icon;
                const isSelected = selectedFormat === format.value;
                return (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value)}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                      isSelected
                        ? "bg-secondary text-secondary-content shadow-md ring-2 ring-secondary/30"
                        : "bg-base-200 text-base-content/70 hover:bg-base-300"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Icon size={16} />
                    <span className="text-sm">{format.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botón de Generación */}
          <GenerateReportButton
            reportType={selectedType}
            format={selectedFormat}
            filters={filters}
            onGenerate={handleGenerateReport}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Info Footer */}
        <div className="mt-4 text-center text-xs text-base-content/50">
          Selecciona tipo, ajusta filtros opcionales y elige formato para
          generar tu reporte
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
