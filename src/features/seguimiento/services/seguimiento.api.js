/**
 * ==============================================
 * API de Seguimiento Deportivo - Kallpa UNL
 * ==============================================
 * 
 * Servicio que encapsula todas las llamadas HTTP
 * del módulo de seguimiento: evaluaciones, tests,
 * estadísticas, reportes y asistencia.
 * 
 * Importante: los componentes NO deben usar Axios.
 * Deben consumir funciones de servicios / hooks.
 */

import http from '@/app/config/http';
import { API_ENDPOINTS } from '@/app/config/constants';

const seguimientoApi = {
  // ==============================================
  // EVALUACIONES
  // ==============================================

  /**
   * Lista evaluaciones (con filtros opcionales)
   * @param {Object} params
   */
  getEvaluations: async (params = {}) => {
    const response = await http.get(API_ENDPOINTS.EVALUATIONS.BASE, { params });
    return response.data;
  },

  /**
   * Crea una evaluación
   * @param {Object} data
   */
  createEvaluation: async (data) => {
    const response = await http.post(API_ENDPOINTS.EVALUATIONS.BASE, data);
    return response.data;
  },

  /**
   * Actualiza una evaluación
   * @param {string|number} id
   * @param {Object} data
   */
  updateEvaluation: async (id, data) => {
    const response = await http.put(API_ENDPOINTS.EVALUATIONS.BY_ID(id), data);
    return response.data;
  },

  /**
   * Elimina una evaluación
   * @param {string|number} id
   */
  deleteEvaluation: async (id) => {
    const response = await http.delete(API_ENDPOINTS.EVALUATIONS.BY_ID(id));
    return response.data;
  },

  // ==============================================
  // TESTS
  // ==============================================

  /**
   * Obtiene resultados de un test por tipo
   * @param {'sprint'|'endurance'|'yoyo'|'technical'} type
   * @param {Object} params
   */
  getTestResults: async (type, params = {}) => {
    const endpointByType = {
      sprint: API_ENDPOINTS.TESTS.SPRINT,
      endurance: API_ENDPOINTS.TESTS.ENDURANCE,
      yoyo: API_ENDPOINTS.TESTS.YOYO,
      technical: API_ENDPOINTS.TESTS.TECHNICAL,
    };

    const endpoint = endpointByType[type];
    if (!endpoint) throw new Error('Tipo de test inválido');

    const response = await http.get(endpoint, { params });
    return response.data;
  },

  // ==============================================
  // ESTADÍSTICAS
  // ==============================================

  /**
   * Obtiene estadísticas generales
   * @param {Object} params
   */
  getStatistics: async (params = {}) => {
    const response = await http.get(API_ENDPOINTS.STATISTICS.BASE, { params });
    return response.data;
  },

  /**
   * Obtiene estadísticas por deportista
   * @param {string|number} athleteId
   * @param {Object} params
   */
  getStatisticsByAthlete: async (athleteId, params = {}) => {
    const response = await http.get(API_ENDPOINTS.STATISTICS.BY_ATHLETE(athleteId), { params });
    return response.data;
  },

  // ==============================================
  // ASISTENCIA
  // ==============================================

  /**
   * Obtiene asistencia por fecha
   * @param {string} date - Formato YYYY-MM-DD
   */
  getAttendanceByDate: async (date) => {
    const response = await http.get(API_ENDPOINTS.ATTENDANCE.BY_DATE(date));
    return response.data;
  },
};

export default seguimientoApi;
