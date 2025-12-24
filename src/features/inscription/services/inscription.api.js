/**
 * ==============================================
 * API de Inscripción - Kallpa UNL
 * ==============================================
 * 
 * Servicio que encapsula todas las llamadas HTTP
 * relacionadas con la inscripción de deportistas.
 * 
 * @author Kallpa UNL Team
 * @version 1.0.0
 */

import http from '@/app/config/http';
import { API_ENDPOINTS } from '@/app/config/constants';

/**
 * Servicio de inscripción
 * Contiene métodos para gestionar atletas y representantes
 */
const inscriptionApi = {
  /**
   * Registra un nuevo deportista mayor de edad
   * @param {Object} athleteData - Datos del deportista
   * @returns {Promise<Object>} Deportista registrado
   */
  registerDeportista: async (athleteData) => {
    const response = await http.post(API_ENDPOINTS.ATHLETES.BASE, athleteData);
    return response.data;
  },
  
  /**
   * Registra un deportista menor de edad con su representante
   * @param {Object} data - Datos del menor y representante
   * @param {Object} data.athlete - Datos del deportista menor
   * @param {Object} data.representative - Datos del representante
   * @returns {Promise<Object>} Datos registrados
   */
  registerMenor: async (data) => {
    const response = await http.post(`${API_ENDPOINTS.ATHLETES.BASE}/menor`, data);
    return response.data;
  },
  
  /**
   * Obtiene la lista de deportistas
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise<Object>} Lista de deportistas
   */
  getAthletes: async (params = {}) => {
    const response = await http.get(API_ENDPOINTS.ATHLETES.BASE, { params });
    return response.data;
  },
  
  /**
   * Obtiene un deportista por ID
   * @param {string|number} id - ID del deportista
   * @returns {Promise<Object>} Datos del deportista
   */
  getAthleteById: async (id) => {
    const response = await http.get(API_ENDPOINTS.ATHLETES.BY_ID(id));
    return response.data;
  },
  
  /**
   * Actualiza datos de un deportista
   * @param {string|number} id - ID del deportista
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Deportista actualizado
   */
  updateAthlete: async (id, data) => {
    const response = await http.put(API_ENDPOINTS.ATHLETES.BY_ID(id), data);
    return response.data;
  },
  
  /**
   * Sube una foto del deportista
   * @param {string|number} id - ID del deportista
   * @param {File} file - Archivo de imagen
   * @returns {Promise<Object>} URL de la imagen
   */
  uploadPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await http.post(
      `${API_ENDPOINTS.ATHLETES.BY_ID(id)}/photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
  
  /**
   * Obtiene las categorías disponibles
   * @returns {Promise<Array>} Lista de categorías
   */
  getCategories: async () => {
    const response = await http.get('/categories');
    return response.data;
  },
};

export default inscriptionApi;
