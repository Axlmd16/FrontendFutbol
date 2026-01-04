/**
 * API de Reportes Deportivos
 *
 * Servicio que encapsula las llamadas HTTP para generación
 * y descarga de reportes en diferentes formatos.
 */

import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

const reportsApi = {
  /**
   * Genera y descarga un reporte en formato específico
   * @param {Object} params - Parámetros del reporte
   * @param {string} params.format - Formato: 'pdf', 'csv', 'xlsx'
   * @param {string} params.start_date - Fecha inicio (YYYY-MM-DD)
   * @param {string} params.end_date - Fecha fin (YYYY-MM-DD)
   * @param {number} params.athlete_id - ID del atleta (opcional)
   * @param {string} params.report_type - Tipo de reporte (opcional)
   * @returns {Promise<Blob>} Archivo descargable
   */
  generateReport: async (params) => {
    try {
      console.info("[reportsApi] Llamando GET /reports con:", params);
      
      const response = await http.get(API_ENDPOINTS.REPORTS.GENERATE, {
        params,
        responseType: "blob",
      });
      
      const contentType = response.headers['content-type'] || '';
      console.info("[reportsApi] Respuesta recibida:", {
        status: response.status,
        contentType: contentType,
        dataType: typeof response.data,
        dataSize: response.data?.size,
      });
      
      // Verificar si el backend devolvió HTML en lugar del archivo
      if (contentType.includes('text/html') || contentType.includes('application/json')) {
        const text = await response.data.text();
        console.error("[reportsApi] Backend devolvió:", text.substring(0, 500));
        
        try {
          const json = JSON.parse(text);
          throw new Error(json.message || json.detail || 'Error del servidor');
        } catch (parseErr) {
          throw new Error('El servidor devolvió una respuesta inesperada. Verifica que el endpoint /reports esté funcionando correctamente.');
        }
      }
      
      return response.data;
    } catch (error) {
      console.error("[reportsApi] Error en generateReport:", error);
      throw error;
    }
  },

  /**
   * Descarga un archivo de reporte
   * @param {Blob} fileData - Datos del archivo
   * @param {string} fileName - Nombre del archivo
   */
  downloadFile: (fileData, fileName) => {
    try {
      console.info("[downloadFile] Iniciando descarga de:", fileName, "Tamaño:", fileData?.size);
      
      // Crear URL del blob directamente
      const blob = new Blob([fileData], { type: fileData.type || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";
      
      document.body.appendChild(link);
      link.click();
      
      // Limpieza
      setTimeout(() => {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
        console.info("[downloadFile] Limpieza completada");
      }, 150);
      
      return true;
    } catch (err) {
      console.error("[downloadFile] Error:", err);
      throw new Error("Error al descargar el archivo: " + err.message);
    }
  },
};

export default reportsApi;
