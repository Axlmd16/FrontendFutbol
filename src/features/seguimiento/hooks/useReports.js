/**
 * Hook personalizado para gestión de Reportes
 * 
 * Encapsula la lógica de generación y descarga de reportes.
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";
import reportsApi from "@/features/seguimiento/services/reports.api";
import { MESSAGES } from "@/app/config/constants";

export const useReports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Genera y descarga un reporte en el formato especificado
   */
  const generateAndDownloadReport = useCallback(
    async (format, filters = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        // Construir parámetros del reporte
        const params = {
          format,
          ...filters,
        };

        // Llamar al backend
        const fileData = await reportsApi.generateReport(params);
        
        // Generar nombre del archivo
        const timestamp = new Date().toISOString().split("T")[0];
        const fileName = `reporte_deportivo_${timestamp}.${format}`;

        // Descargar archivo
        reportsApi.downloadFile(fileData, fileName);

        toast.success("Reporte descargado exitosamente");
        return true;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Error al generar el reporte";
        setError(errorMessage);
        toast.error("Error al generar reporte", {
          description: errorMessage,
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    generateAndDownloadReport,
    clearError,
  };
};

export default useReports;
