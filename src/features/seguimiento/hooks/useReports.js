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
      if (!format) {
        setError("Selecciona un formato para generar el reporte");
        toast.error("Selecciona un formato para generar el reporte");
        return false;
      }

      // Validar rango de fechas solo si ambas están presentes
      if (filters.start_date && filters.end_date) {
        const start = new Date(filters.start_date);
        const end = new Date(filters.end_date);
        if (start > end) {
          setError("La fecha inicio no puede ser mayor a la fecha fin");
          toast.error("Rango de fechas inválido", {
            description: "La fecha inicio debe ser menor o igual a la fecha fin",
          });
          return false;
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        // Construir parámetros del reporte
        const normalizeDate = (value) => {
          if (!value) return undefined;
          // Si viene en dd/mm/yyyy, lo reordenamos; si viene en yyyy-mm-dd lo dejamos.
          if (value.includes("/")) {
            const [day, month, year] = value.split(/[\/]/);
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          }
          return value;
        };

        const rawParams = {
          format: format.toLowerCase(),
          ...filters,
          start_date: normalizeDate(filters.start_date),
          end_date: normalizeDate(filters.end_date),
        };

        const params = Object.entries(rawParams).reduce((acc, [key, value]) => {
          if (value === "" || value === null || value === undefined) return acc;
          // Filtrar parámetros no soportados por el backend
          if (key === "category") return acc; // Backend no soporta este parámetro
          if (key === "athlete_id") {
            acc[key] = Number(value);
            return acc;
          }
          acc[key] = value;
          return acc;
        }, {});

        // Llamar al backend
        console.info("[reports] Solicitando reporte con params:", params);
        
        const response = await reportsApi.generateReport(params);
        
        console.info("[reports] Respuesta recibida:", {
          type: response?.type,
          size: response?.size,
          isBlob: response instanceof Blob,
        });
        
        // Generar nombre del archivo
        const timestamp = new Date().toISOString().split("T")[0];
        const fileName = `reporte_deportivo_${timestamp}.${format.toLowerCase()}`;

        console.info("[reports] Iniciando descarga:", fileName);
        
        // Descargar archivo
        reportsApi.downloadFile(response, fileName);

        console.info("[reports] Proceso completado");
        toast.success("Reporte descargado exitosamente");
        return true;
      } catch (err) {
        let errorMessage = err.message || "Error al generar el reporte";
        let statusInfo = "";

        // Intentar leer mensajes del backend cuando viene blob
        if (err.response?.data instanceof Blob) {
          try {
            const text = await err.response.data.text();
            statusInfo = `${err.response?.status || ""} ${err.response?.statusText || ""}`.trim();
            const parsed = JSON.parse(text);
            errorMessage = parsed.message || errorMessage;
          } catch (parseErr) {
            try {
              const text = await err.response.data.text();
              statusInfo = `${err.response?.status || ""} ${err.response?.statusText || ""}`.trim();
              errorMessage = text || errorMessage;
            } catch (_) {
              // mantener mensaje previo
            }
          }
        } else if (err.response?.data?.message) {
          statusInfo = `${err.response?.status || ""} ${err.response?.statusText || ""}`.trim();
          errorMessage = err.response.data.message;
        }

        const composedMessage = [statusInfo, errorMessage].filter(Boolean).join(" - ");

        setError(composedMessage);
        toast.error("Error al generar reporte", {
          description: composedMessage,
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
