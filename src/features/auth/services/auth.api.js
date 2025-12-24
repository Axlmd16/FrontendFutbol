/**
 * ==============================================
 * API de Autenticación - Kallpa UNL
 * ==============================================
 * 
 * Servicio que encapsula todas las llamadas HTTP
 * relacionadas con autenticación.
 * 
 * @author Kallpa UNL Team
 * @version 1.0.0
 */

import http from '@/app/config/http';
import { API_ENDPOINTS } from '@/app/config/constants';

/**
 * Servicio de autenticación
 * Contiene todos los métodos para interactuar con la API de auth
 */
const authApi = {
  /**
   * Inicia sesión con credenciales
   * @param {Object} credentials - Credenciales del usuario
   * @param {string} credentials.email - Email o username
   * @param {string} credentials.password - Contraseña
   * @returns {Promise<Object>} Respuesta con token y datos del usuario
   * 
   * @example
   * const response = await authApi.login({ email: 'user@example.com', password: '123456' });
   * // response.data = { token: 'jwt...', user: { id, name, email, role } }
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
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} Respuesta de confirmación
   * 
   * @example
   * await authApi.forgotPassword('user@example.com');
   */
  forgotPassword: async (email) => {
    const response = await http.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },
  
  /**
   * Restablece la contraseña con un token
   * @param {Object} data - Datos para restablecer
   * @param {string} data.token - Token de recuperación
   * @param {string} data.password - Nueva contraseña
   * @param {string} data.passwordConfirmation - Confirmación de contraseña
   * @returns {Promise<Object>} Respuesta de confirmación
   * 
   * @example
   * await authApi.resetPassword({
   *   token: 'reset-token-from-email',
   *   password: 'newPassword123',
   *   passwordConfirmation: 'newPassword123'
   * });
   */
  resetPassword: async (data) => {
    const response = await http.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },
  
  /**
   * Obtiene los datos del usuario actual
   * Usa el token almacenado para identificar al usuario
   * @returns {Promise<Object>} Datos del usuario autenticado
   */
  getCurrentUser: async () => {
    const response = await http.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
  
  /**
   * Refresca el token de autenticación
   * Útil para mantener la sesión activa
   * @returns {Promise<Object>} Nuevo token
   */
  refreshToken: async () => {
    const response = await http.post(API_ENDPOINTS.AUTH.REFRESH);
    return response.data;
  },
};

export default authApi;
