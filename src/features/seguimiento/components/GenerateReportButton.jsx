/**
 * Componente Botón de Generación de Reporte
 * 
 * Botón especializado para generar y descargar reportes
 * con estados de carga y feedback.
 */

import { Download, AlertCircle } from "lucide-react";
import Button from "@/shared/components/Button";

const GenerateReportButton = ({
  format,
  filters,
  onGenerate,
  isLoading = false,
  disabled = false,
  error = null,
}) => {
  const handleClick = () => {
    if (!format) {
      alert("Por favor selecciona un formato de exportación");
      return;
    }

    onGenerate();
  };

  const hasFilters = Object.values(filters).some(v => v);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Generar Reporte
        </h3>
        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="text-sm text-slate-600 space-y-1">
          <p>
            <strong>Formato seleccionado:</strong>{" "}
            <span className={format ? "text-primary font-semibold" : "text-slate-400"}>
              {format ? format.toUpperCase() : "No seleccionado"}
            </span>
          </p>
          <p>
            <strong>Filtros aplicados:</strong>{" "}
            <span className={hasFilters ? "text-primary font-semibold" : "text-slate-400"}>
              {hasFilters ? "Sí" : "No"}
            </span>
          </p>
        </div>

        <Button
          onClick={handleClick}
          variant="primary"
          size="lg"
          disabled={disabled || isLoading || !format}
          loading={isLoading}
          fullWidth
        >
          <Download size={20} />
          {isLoading ? "Generando reporte..." : "Descargar Reporte"}
        </Button>

        {!format && (
          <p className="text-xs text-slate-500 text-center">
            Selecciona un formato para continuar
          </p>
        )}
      </div>
    </div>
  );
};

export default GenerateReportButton;
