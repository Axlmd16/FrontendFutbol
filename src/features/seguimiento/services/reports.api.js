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
    const response = await http.get(API_ENDPOINTS.REPORTS.GENERATE, {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Descarga un archivo de reporte
   * @param {Blob} fileData - Datos del archivo
   * @param {string} fileName - Nombre del archivo
   */
  downloadFile: (fileData, fileName) => {
    const url = window.URL.createObjectURL(fileData);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentElement.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default reportsApi;
