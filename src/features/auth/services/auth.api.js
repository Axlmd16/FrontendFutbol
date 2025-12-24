/**
 * API de Autenticación
 *
 * Servicio que encapsula todas las llamadas HTTP
 * relacionadas con autenticación.
 */

import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

/**
 * Servicio de autenticación
 * Contiene todos los métodos para interactuar con la API de auth
 */
const authApi = {
  /**
   * Inicia sesión con credenciales
   */
  login: async (credentials) => {
    const response = await http.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  /**
   * Cierra la sesión del usuario actual
   * Invalida el token en el servidor
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  logout: async () => {
    const response = await http.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  /**
   * Solicita recuperación de contraseña
   * Envía un email con instrucciones para restablecer
   *
   */
  forgotPassword: async (email) => {
    const response = await http.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  },

  /**
   * Restablece la contraseña con un token
   */
  resetPassword: async (data) => {
    const response = await http.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  /**
   * Obtiene los datos del usuario actual
   * Usa el token almacenado para identificar al usuario
   */
  getCurrentUser: async () => {
    const response = await http.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  /**
   * Refresca el token de autenticación
   */
  refreshToken: async () => {
    const response = await http.post(API_ENDPOINTS.AUTH.REFRESH);
    return response.data;
  },
};

export default authApi;
