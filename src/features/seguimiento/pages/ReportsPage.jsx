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
import GenerateReportButton from "@/features/seguimiento/components/GenerateReportButton";
import useReports from "@/features/seguimiento/hooks/useReports";
import athletesApi from "@/features/athletes/services/athletes.api";
import Loader from "@/shared/components/Loader";
import { FileBarChart } from "lucide-react";

const ReportsPage = () => {
  const { isLoading, error, generateAndDownloadReport, clearError } = useReports();

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
    setFilters(prev => ({ ...prev, ...newFilters }));
    clearError();
  };

  // Aplicar rango de fechas
  const handleApplyDateRange = (dateRange) => {
    setFilters(prev => ({
      ...prev,
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
    }));
    clearError();
  };

  // Generar y descargar reporte
  const handleGenerateReport = async () => {
    await generateAndDownloadReport(selectedFormat, filters);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileBarChart size={32} className="text-primary" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Reportes Deportivos
            </h1>
          </div>
          <p className="text-slate-500 mt-1 text-sm">
            Genera y descarga reportes personalizados del club
          </p>
        </div>

        {athletesLoading ? (
          <Loader />
        ) : (
          <div className="space-y-6">
            {/* Filtros de búsqueda */}
            <ReportsFilters
              athletes={athletes}
              onFilter={handleApplyFilters}
              isLoading={isLoading}
            />

            {/* Selector de rango de fechas */}
            <DateRangePicker
              onDateRangeChange={handleApplyDateRange}
              disabled={isLoading}
            />

            {/* Selector de formato */}
            <ExportFormatSelector
              selectedFormat={selectedFormat}
              onFormatChange={setSelectedFormat}
              disabled={isLoading}
            />

            {/* Botón de generación */}
            <GenerateReportButton
              format={selectedFormat}
              filters={filters}
              onGenerate={handleGenerateReport}
              isLoading={isLoading}
              error={error}
            />

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                💡 Cómo usar los reportes
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Selecciona los filtros que desees aplicar al reporte (opcional)
                </li>
                <li>
                  • Elige el formato de exportación (PDF, CSV o XLSX)
                </li>
                <li>
                  • Haz clic en "Descargar Reporte" para obtener tu archivo
                </li>
                <li>
                  • El reporte incluirá asistencias, evaluaciones y resultados de pruebas
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
