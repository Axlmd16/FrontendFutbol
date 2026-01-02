/**
 * ==============================================
 * Configuración Global de Axios - Kallpa UNL
 * ==============================================
 *
 * Instancia centralizada de Axios con:
 * - Base URL configurable por variables de entorno
 * - Interceptor para agregar token de autorización
 * - Interceptor para manejar errores 401 con refresh token automático
 */

import axios from "axios";
import { AUTH_TOKEN_KEY, AUTH_REFRESH_TOKEN_KEY } from "./constants";
import { toast } from "sonner";

// Endpoints de auth pública que no deben forzar redirect en 401
const isPublicAuthPath = (url = "") => {
  return [
    "/accounts/login",
    "/accounts/password-reset/request",
    "/accounts/password-reset/confirm",
    "/accounts/refresh",
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

// Estado para evitar múltiples llamadas concurrentes de refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
 * Maneja errores globales, especialmente 401 con refresh automático
 */
http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response, config } = error;
    const originalRequest = config;

    // 401 (Unauthorized) - Intentar refresh antes de forzar logout
    if (response?.status === 401) {
      // Si es un endpoint público de auth, no intentar refresh
      if (isPublicAuthPath(config?.url)) {
        return Promise.reject(
          new Error(response?.data?.detail || "Credenciales inválidas")
        );
      }

      // Si ya intentamos refresh en esta request, forzar logout
      if (originalRequest._retry) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject(
          new Error("Sesión expirada. Por favor, inicia sesión nuevamente.")
        );
      }

      // Si ya hay un refresh en progreso, encolar esta request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return http(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);

      // Si no hay refresh token, forzar logout
      if (!refreshToken) {
        isRefreshing = false;
        localStorage.removeItem(AUTH_TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject(
          new Error("Sesión expirada. Por favor, inicia sesión nuevamente.")
        );
      }

      try {
        // Intentar refrescar el token
        const refreshResponse = await axios.post(
          `${http.defaults.baseURL}/accounts/refresh`,
          { refresh_token: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = refreshResponse.data?.data?.access_token;
        const newRefreshToken = refreshResponse.data?.data?.refresh_token;

        if (newAccessToken) {
          // Guardar nuevos tokens
          localStorage.setItem(AUTH_TOKEN_KEY, newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, newRefreshToken);
          }

          // Procesar requests encoladas
          processQueue(null, newAccessToken);

          // Reintentar la request original
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return http(originalRequest);
        } else {
          throw new Error("No se recibió nuevo token");
        }
      } catch (refreshError) {
        // Refresh falló, forzar logout
        processQueue(refreshError, null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject(
          new Error("Sesión expirada. Por favor, inicia sesión nuevamente.")
        );
      } finally {
        isRefreshing = false;
      }
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

    // 400 (Bad Request)
    if (response?.status === 400) {
      console.error("[HTTP 400]:", response?.data);
      const errorMessage =
        response?.data?.message ||
        response?.data?.detail ||
        "Solicitud inválida.";
      return Promise.reject(new Error(errorMessage));
    }

    // 500 (Server Error)
    if (response?.status >= 500) {
      console.error("[HTTP 5xx]:", "Error del servidor");
      return Promise.reject(
        new Error("Error del servidor. Intenta más tarde.")
      );
    }

    // 422 (Validation Error)
    if (response?.status === 422) {
      const data = response?.data;

      // 1) Nuestro backend (ResponseSchema)
      const message = typeof data?.message === "string" ? data.message : null;

      // errors puede venir como dict {field:[msg]} o lista [{field,message,...}]
      const errors = data?.errors;
      let firstError = null;

      if (Array.isArray(errors) && errors.length > 0) {
        firstError = errors[0]?.message || null;
      } else if (errors && typeof errors === "object") {
        const firstKey = Object.keys(errors)[0];
        const val = firstKey ? errors[firstKey] : null;
        firstError = Array.isArray(val) ? val[0] : val;
      }

      // 2) FastAPI default (detail)
      const detail = data?.detail;
      if (!firstError && Array.isArray(detail) && detail.length > 0) {
        firstError = detail[0]?.msg || null;
      }
      if (!firstError && typeof detail === "string") {
        firstError = detail;
      }

      const errorMsg = firstError || message || "Error de validación de datos.";
      // Mostrar el error como toast
      toast.error(errorMsg);

      // Crear un error con la estructura esperada por los hooks
      const validationError = new Error(errorMsg);
      validationError.response = { data: { detail: errorMsg } };
      return Promise.reject(validationError);
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
