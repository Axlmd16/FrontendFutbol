/**
 * Componente Selector de Formato de Exportación
 * 
 * Permite elegir entre PDF, CSV o XLSX para descargar el reporte.
 */

import { FileText, FileSpreadsheet, Table } from "lucide-react";

const EXPORT_FORMATS = [
  {
    value: "pdf",
    label: "PDF",
    description: "Formato visual con estilo",
    icon: FileText,
  },
  {
    value: "csv",
    label: "CSV",
    description: "Para análisis en Excel",
    icon: Table,
  },
  {
    value: "xlsx",
    label: "XLSX",
    description: "Hoja de cálculo Excel",
    icon: FileSpreadsheet,
  },
];

const ExportFormatSelector = ({ selectedFormat, onFormatChange, disabled = false }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Formato de Exportación
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EXPORT_FORMATS.map((format) => {
          const Icon = format.icon;
          return (
            <button
              key={format.value}
              onClick={() => !disabled && onFormatChange(format.value)}
              disabled={disabled}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedFormat === format.value
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 bg-white hover:border-slate-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon size={32} className={selectedFormat === format.value ? "text-primary" : "text-slate-600"} />
                <h4 className="font-semibold text-slate-900">{format.label}</h4>
                <p className="text-sm text-slate-600">{format.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExportFormatSelector;
