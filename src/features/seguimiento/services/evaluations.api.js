/**
 * API de Evaluaciones
 *
 * Servicio que encapsula todas las llamadas HTTP
 * relacionadas con la gestión de evaluaciones y tests.
 */

import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

const evaluationsApi = {
  // ===============================================
  // EVALUACIONES - CRUD
  // ===============================================

  /**
   * Obtiene la lista de evaluaciones con paginación
   * @param {Object} params - Parámetros de consulta
   * @param {number} params.skip - Número de registros a saltar
   * @param {number} params.limit - Cantidad por página
   * @returns {Promise<Object>} Lista paginada de evaluaciones
   */
  getAll: async (params = { skip: 0, limit: 20 }) => {
    const response = await http.get(API_ENDPOINTS.EVALUATIONS.BASE, { params });
    return response.data;
  },

  /**
   * Obtiene una evaluación por su ID
   * @param {string|number} id - ID de la evaluación
   * @returns {Promise<Object>} Datos de la evaluación
   */
  getById: async (id) => {
    const response = await http.get(API_ENDPOINTS.EVALUATIONS.BY_ID(id));
    return response.data;
  },

  /**
   * Obtiene evaluaciones de un usuario específico
   * @param {string|number} userId - ID del usuario
   * @returns {Promise<Object>} Evaluaciones del usuario
   */
  getByUser: async (userId) => {
    const response = await http.get(API_ENDPOINTS.EVALUATIONS.BY_USER(userId));
    return response.data;
  },

  /**
   * Crea una nueva evaluación
   * @param {Object} evaluationData - Datos de la evaluación
   * @param {string} evaluationData.name - Nombre de la evaluación
   * @param {string} evaluationData.date - Fecha ISO
   * @param {string} evaluationData.time - Hora (HH:mm)
   * @param {number} evaluationData.user_id - ID del usuario creador
   * @param {string} [evaluationData.location] - Ubicación (opcional)
   * @param {string} [evaluationData.observations] - Observaciones (opcional)
   * @returns {Promise<Object>} Evaluación creada
   */
  create: async (evaluationData) => {
    const response = await http.post(
      API_ENDPOINTS.EVALUATIONS.CREATE,
      evaluationData
    );
    return response.data;
  },

  /**
   * Actualiza una evaluación existente
   * @param {string|number} id - ID de la evaluación
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Evaluación actualizada
   */
  update: async (id, updateData) => {
    const response = await http.put(
      API_ENDPOINTS.EVALUATIONS.UPDATE(id),
      updateData
    );
    return response.data;
  },

  /**
   * Elimina una evaluación (soft delete)
   * @param {string|number} id - ID de la evaluación
   * @returns {Promise<Object>} Evaluación eliminada
   */
  delete: async (id) => {
    const response = await http.delete(
      API_ENDPOINTS.EVALUATIONS.DELETE(id)
    );
    return response.data;
  },

  // ===============================================
  // TESTS - SPRINT
  // ===============================================

  /**
   * Crea un test de velocidad (sprint)
   * @param {Object} testData - Datos del test
   * @param {number} testData.athlete_id - ID del deportista
   * @param {string} testData.date - Fecha ISO
   * @param {number} testData.evaluation_id - ID de la evaluación
   * @param {number} testData.distance_meters - Distancia en metros
   * @param {number} testData.time_0_10_s - Tiempo 0-10m en segundos
   * @param {number} testData.time_0_30_s - Tiempo 0-30m en segundos
   * @param {string} [testData.observations] - Observaciones (opcional)
   * @returns {Promise<Object>} Test creado
   */
  createSprintTest: async (testData) => {
    const response = await http.post(API_ENDPOINTS.TESTS.SPRINT, testData);
    return response.data;
  },

  // ===============================================
  // TESTS - YOYO
  // ===============================================

  /**
   * Crea un test Yoyo
   * @param {Object} testData - Datos del test
   * @param {number} testData.athlete_id - ID del deportista
   * @param {string} testData.date - Fecha ISO
   * @param {number} testData.evaluation_id - ID de la evaluación
   * @param {number} testData.shuttle_count - Número de lanzaderas
   * @param {string} testData.final_level - Nivel final alcanzado
   * @param {number} testData.failures - Cantidad de fallos
   * @param {string} [testData.observations] - Observaciones (opcional)
   * @returns {Promise<Object>} Test creado
   */
  createYoyoTest: async (testData) => {
    const response = await http.post(API_ENDPOINTS.TESTS.YOYO, testData);
    return response.data;
  },

  // ===============================================
  // TESTS - RESISTENCIA
  // ===============================================

  /**
   * Crea un test de resistencia
   * @param {Object} testData - Datos del test
   * @param {number} testData.athlete_id - ID del deportista
   * @param {string} testData.date - Fecha ISO
   * @param {number} testData.evaluation_id - ID de la evaluación
   * @param {number} testData.min_duration - Duración en minutos
   * @param {number} testData.total_distance_m - Distancia total en metros
   * @param {string} [testData.observations] - Observaciones (opcional)
   * @returns {Promise<Object>} Test creado
   */
  createEnduranceTest: async (testData) => {
    const response = await http.post(
      API_ENDPOINTS.TESTS.ENDURANCE,
      testData
    );
    return response.data;
  },

  // ===============================================
  // TESTS - TÉCNICO
  // ===============================================

  /**
   * Crea una evaluación técnica
   * @param {Object} testData - Datos del test
   * @param {number} testData.athlete_id - ID del deportista
   * @param {string} testData.date - Fecha ISO
   * @param {number} testData.evaluation_id - ID de la evaluación
   * @param {string} testData.ball_control - Escala: MUY_BAJO, BAJO, MEDIO, ALTO, MUY_ALTO
   * @param {string} testData.short_pass - Escala: MUY_BAJO, BAJO, MEDIO, ALTO, MUY_ALTO
   * @param {string} testData.long_pass - Escala: MUY_BAJO, BAJO, MEDIO, ALTO, MUY_ALTO
   * @param {string} testData.shooting - Escala: MUY_BAJO, BAJO, MEDIO, ALTO, MUY_ALTO
   * @param {string} testData.dribbling - Escala: MUY_BAJO, BAJO, MEDIO, ALTO, MUY_ALTO
   * @param {string} [testData.observations] - Observaciones (opcional)
   * @returns {Promise<Object>} Test creado
   */
  createTechnicalAssessment: async (testData) => {
    const response = await http.post(
      API_ENDPOINTS.TESTS.TECHNICAL,
      testData
    );
    return response.data;
  },
};

export default evaluationsApi;
