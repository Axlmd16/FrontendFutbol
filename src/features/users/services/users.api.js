/**
 * API de Usuarios
 *
 * Servicio que encapsula todas las llamadas HTTP
 * relacionadas con la gestión de usuarios.
 */

import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

const usersApi = {
  /**
   * Obtiene la lista de usuarios con paginación y filtros
   * @param {Object} params - Parámetros de consulta
   * @param {number} params.page - Número de página
   * @param {number} params.limit - Cantidad por página
   * @param {string} params.search - Término de búsqueda
   * @param {string} params.role - Filtro por rol
   * @returns {Promise<Object>} Lista paginada de usuarios
   */
  getAll: async (params = {}) => {
    const response = await http.get(API_ENDPOINTS.USERS.GET_ALL, { params });
    return response.data;
  },

  /**
   * Obtiene un usuario por su ID
   * @param {string|number} id - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  getById: async (id) => {
    const response = await http.get(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise<Object>} Usuario creado
   */
  create: async (userData) => {
    const response = await http.post(API_ENDPOINTS.USERS.CREATE, userData);
    return response.data;
  },

  /**
   * Actualiza un usuario existente
   * @param {string|number} id - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  update: async (id, userData) => {
    const response = await http.put(API_ENDPOINTS.USERS.UPDATE(id), userData);
    return response.data;
  },

  /**
   * Desactiva un usuario (soft delete)
   * @param {string|number} id - ID del usuario
   * @returns {Promise<Object>} Usuario desactivado
   */
  desactivate: async (id) => {
    const response = await http.patch(API_ENDPOINTS.USERS.DESACTIVATE(id));
    return response.data;
  },

  /**
   * Cambia el estado activo/inactivo de un usuario
   * @param {string|number} id - ID del usuario
   * @param {boolean} active - Nuevo estado
   * @returns {Promise<Object>} Usuario actualizado
   */
  toggleStatus: async (id, active) => {
    const response = await http.patch(API_ENDPOINTS.USERS.BY_ID(id), {
      active,
    });
    return response.data;
  },

  /**
   * Obtiene el perfil del usuario actual
   * @returns {Promise<Object>} Datos del usuario actual
   */
  getMe: async () => {
    const response = await http.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  /**
   * Verifica si un DNI ya está registrado
   * @param {string} dni - DNI a verificar
   * @param {string|number} excludeId - ID del usuario a excluir (para edición)
   * @returns {Promise<boolean>} true si está disponible, false si está ocupado
   */
  checkDniAvailable: async (dni, excludeId = null) => {
    try {
      const params = { dni };
      if (excludeId) params.exclude_id = excludeId;
      const response = await http.get(`${API_ENDPOINTS.USERS.BASE}/check-dni`, { params });
      return response.data?.available ?? true;
    } catch (error) {
      // Si el endpoint no existe, asumir disponible para no bloquear
      console.warn("Endpoint check-dni no disponible:", error);
      return true;
    }
  },

  /**
   * Verifica si un email ya está registrado
   * @param {string} email - Email a verificar
   * @param {string|number} excludeId - ID del usuario a excluir (para edición)
   * @returns {Promise<boolean>} true si está disponible, false si está ocupado
   */
  checkEmailAvailable: async (email, excludeId = null) => {
    try {
      const params = { email };
      if (excludeId) params.exclude_id = excludeId;
      const response = await http.get(`${API_ENDPOINTS.USERS.BASE}/check-email`, { params });
      return response.data?.available ?? true;
    } catch (error) {
      // Si el endpoint no existe, asumir disponible para no bloquear
      console.warn("Endpoint check-email no disponible:", error);
      return true;
    }
  },
};

export default usersApi;
