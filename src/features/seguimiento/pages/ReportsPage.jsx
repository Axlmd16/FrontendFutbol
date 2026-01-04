/**
 * Página de Reportes Deportivos
 *
 * Interfaz principal que permite al entrenador
 * buscar, filtrar y descargar reportes deportivos.
 */

import { useEffect, useState } from "react";
import ReportsFilters from "@/features/seguimiento/components/ReportsFilters";
import DateRangePicker from "@/features/seguimiento/components/DateRangePicker";
import ExportFormatSelector from "@/features/seguimiento/components/ExportFormatSelector";
import ReportTypeSelector from "@/features/seguimiento/components/ReportTypeSelector";
import GenerateReportButton from "@/features/seguimiento/components/GenerateReportButton";
import useReports from "@/features/seguimiento/hooks/useReports";
import athletesApi from "@/features/athletes/services/athletes.api";
import Loader from "@/shared/components/Loader";
import { FileBarChart, Info } from "lucide-react";

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

  // Aplicar filtros
  const handleApplyFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    clearError();
  };

  // Aplicar rango de fechas
  const handleApplyDateRange = (dateRange) => {
    setFilters((prev) => ({
      ...prev,
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
    }));
    clearError();
  };

  // Generar y descargar reporte
  const handleGenerateReport = async () => {
    // Construir filtros para el backend
    const backendFilters = {};

    if (filters.category) {
      backendFilters.athlete_type = filters.category;
    }
    if (filters.athlete_id) {
      backendFilters.athlete_id = parseInt(filters.athlete_id);
    }
    if (filters.start_date) {
      backendFilters.start_date = filters.start_date;
    }
    if (filters.end_date) {
      backendFilters.end_date = filters.end_date;
    }

    await generateAndDownloadReport(
      selectedType,
      selectedFormat,
      backendFilters
    );
  };

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setFilters({
      category: "",
      athlete_id: "",
      start_date: "",
      end_date: "",
    });
    setSelectedFormat("");
    setSelectedType("");
    clearError();
  };

  const hasActiveFilters =
    filters.category ||
    filters.athlete_id ||
    filters.start_date ||
    filters.end_date ||
    selectedFormat ||
    selectedType;

  if (athletesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-primary mb-1">
            <span className="bg-primary/10 p-1.5 rounded-lg">
              <FileBarChart size={16} />
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Módulo de Reportes
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Reportes Deportivos
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Genera y descarga reportes personalizados con datos de asistencia,
            evaluaciones y estadísticas
          </p>
        </div>

        <div className="space-y-6">
          {/* Selector de tipo de reporte */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4">
              <h3 className="font-semibold text-base-content mb-3">
                Tipo de Reporte
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Selecciona el tipo de reporte que deseas generar
              </p>

              <ReportTypeSelector
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Filtros de búsqueda - Solo mostrar si se seleccionó un tipo */}
          {selectedType && (
            <>
              <ReportsFilters
                athletes={athletes}
                onFilter={handleApplyFilters}
                isLoading={isLoading}
              />

              {/* Selector de rango de fechas - Solo para attendance y tests */}
              {(selectedType === "attendance" || selectedType === "tests") && (
                <DateRangePicker
                  onDateRangeChange={handleApplyDateRange}
                  disabled={isLoading}
                />
              )}

              {/* Selector de formato de exportación */}
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body p-4">
                  <h3 className="font-semibold text-base-content mb-3">
                    Formato de Exportación
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Selecciona el formato en el que deseas descargar tu reporte
                  </p>

                  <ExportFormatSelector
                    selectedFormat={selectedFormat}
                    onFormatChange={setSelectedFormat}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Botón limpiar filtros */}
              {hasActiveFilters && (
                <div className="flex justify-end">
                  <button
                    onClick={handleClearFilters}
                    className="btn btn-sm btn-ghost text-error hover:bg-error/10"
                    disabled={isLoading}
                  >
                    Limpiar Todo
                  </button>
                </div>
              )}

              {/* Botón de generación */}
              <GenerateReportButton
                reportType={selectedType}
                format={selectedFormat}
                filters={filters}
                onGenerate={handleGenerateReport}
                isLoading={isLoading}
                error={error}
              />
            </>
          )}

          {/* Información adicional */}
          <div className="card bg-info/5 border border-info/20">
            <div className="card-body p-4">
              <div className="flex gap-3">
                <div className="shrink-0">
                  <div className="bg-info/10 p-2 rounded-lg">
                    <Info size={20} className="text-info" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Cómo usar los reportes
                  </h3>
                  <ul className="text-sm text-slate-600 space-y-1.5">
                    <li>
                      • <strong>Tipo de reporte:</strong> Selecciona entre
                      Asistencia, Tests o Estadísticas
                    </li>
                    <li>
                      • <strong>Filtros:</strong> Aplica filtros opcionales por
                      tipo de deportista y fechas
                    </li>
                    <li>
                      • <strong>Formato:</strong> Elige PDF (visual), XLSX
                      (Excel) o CSV (datos)
                    </li>
                    <li>
                      • <strong>Generar:</strong> Descarga tu reporte formal con
                      metadata
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
