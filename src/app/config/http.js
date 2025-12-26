/**
 * ==============================================
 * Configuración Global de Axios - Kallpa UNL
 * ==============================================
 *
 * Instancia centralizada de Axios con:
 * - Base URL configurable por variables de entorno
 * - Interceptor para agregar token de autorización
 * - Interceptor para manejar errores 401 y redirección
 */

import axios from "axios";
import { AUTH_TOKEN_KEY } from "./constants";

// Endpoints de auth pública que no deben forzar redirect en 401
const isPublicAuthPath = (url = "") => {
  return [
    "/accounts/login",
    "/accounts/password-reset/request",
    "/accounts/password-reset/confirm",
  ].some((path) => url.includes(path));
};

/**
 * Instancia de Axios configurada globalmente
 * Base URL se obtiene de las variables de entorno de Vite
 */
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  timeout: 30000, // 30 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Interceptor de REQUEST
 * Agrega automáticamente el token de autorización a cada petición
 */
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("[HTTP Request Error]:", error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de RESPONSE
 * Maneja errores globales, especialmente 401 (no autorizado)
 */
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response, config } = error;

    // 401 (Unauthorized)
    if (response?.status === 401) {
      if (isPublicAuthPath(config?.url)) {
        return Promise.reject(
          new Error(response?.data?.detail || "Credenciales inválidas")
        );
      }

      // Limpiar token almacenado
      localStorage.removeItem(AUTH_TOKEN_KEY);

      // Redirigir a la página de login
      window.location.href = "/login";

      return Promise.reject(
        new Error("Sesión expirada. Por favor, inicia sesión nuevamente.")
      );
    }

    //  403 (Forbidden)
    if (response?.status === 403) {
      console.error("[HTTP 403]:", "Acceso denegado - Permisos insuficientes");
      return Promise.reject(
        new Error("No tienes permisos para realizar esta acción.")
      );
    }

    // 404 Not Found
    if (response?.status === 404) {
      console.error("[HTTP 404]:", "Recurso no encontrado");
      return Promise.reject(new Error("El recurso solicitado no existe."));
    }

    // 500 (Server Error)
    if (response?.status >= 500) {
      console.error("[HTTP 5xx]:", "Error del servidor");
      return Promise.reject(
        new Error("Error del servidor. Intenta más tarde.")
      );
    }

    // Error genérico
    const errorMessage =
      response?.data?.message ||
      response?.data?.detail ||
      "Ocurrió un error inesperado";
    return Promise.reject(new Error(errorMessage));
  }
);

export default http;
