/**
 * Archivo centralizado de constantes del sistema.
 */

/**
 * Clave para almacenar el token de autenticación
 */
export const AUTH_TOKEN_KEY = "kallpa_auth_token";

/**
 * Clave para almacenar información del usuario
 */
export const USER_DATA_KEY = "kallpa_user_data";

/**
 * Clave para almacenar preferencias del usuario
 */
export const USER_PREFERENCES_KEY = "kallpa_preferences";

// RUTAS DE LA APLICACIÓN

export const ROUTES = {
  // Landing
  LANDING: "/",

  //? Rutas públicas (sin autenticación)
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Registro público
  REGISTER: "/register",
  REGISTER_SCHOOL: "/register/escuela",
  REGISTER_CLUB: "/register/club",

  // Rutas de registro de atletas para clubes y escuelas
  INSCRIPTION: "/inscription",
  INSCRIPTION_DEPORTISTA: "/inscription/deportista",
  INSCRIPTION_MENOR: "/inscription/menor",

  //? Rutas privadas (requieren autenticación)
  DASHBOARD: "/dashboard",

  // Usuarios
  USERS: "/users",
  USERS_CREATE: "/users/create",
  USERS_EDIT: "/users/edit/:id",

  // //   Inscripción
  //   INSCRIPTION: '/inscription',
  //   INSCRIPTION_DEPORTISTA: '/inscription/deportista',
  //   INSCRIPTION_MENOR: '/inscription/menor',

  // Seguimiento
  SEGUIMIENTO: "/seguimiento",
  EVALUATIONS: "/seguimiento/evaluations",
  STATISTICS: "/seguimiento/statistics",
  ATTENDANCE: "/seguimiento/attendance",
  REPORTS: "/seguimiento/reports",

  // Perfil y configuración
  PROFILE: "/profile",
  SETTINGS: "/settings",
};

// ==============================================
// CONFIGURACIÓN DE PAGINACIÓN

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
};

// ==============================================
// MENSAJES DEL SISTEMA

export const MESSAGES = {
  // Éxito
  SUCCESS: {
    LOGIN: "¡Bienvenido a Kallpa UNL!",
    LOGOUT: "Sesión cerrada correctamente",
    CREATED: "Registro creado exitosamente",
    UPDATED: "Registro actualizado exitosamente",
    DELETED: "Registro eliminado exitosamente",
    PASSWORD_RESET_SENT: "Se ha enviado un correo con las instrucciones",
    PASSWORD_CHANGED: "Contraseña actualizada correctamente",
  },

  // Errores
  ERROR: {
    GENERIC: "Ocurrió un error inesperado",
    NETWORK: "Error de conexión. Verifica tu internet",
    UNAUTHORIZED: "No estás autorizado para realizar esta acción",
    NOT_FOUND: "El recurso solicitado no existe",
    VALIDATION: "Por favor, verifica los datos ingresados",
    LOGIN_FAILED: "Credenciales inválidas",
  },

  // Confirmaciones
  CONFIRM: {
    DELETE: "¿Estás seguro de eliminar este registro?",
    LOGOUT: "¿Deseas cerrar sesión?",
    UNSAVED_CHANGES: "Tienes cambios sin guardar. ¿Deseas continuar?",
  },
};

// CONFIGURACIÓN DE VALIDACIONES

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PHONE_PATTERN: /^[0-9]{10}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CI_PATTERN: /^[0-9]{10}$/,
};

// ESTADOS Y OPCIONES

/**
 * Estados de evaluación
 */
export const EVALUATION_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

/**
 * Tipos de test deportivos
 */
export const TEST_TYPES = {
  SPRINT: "sprint",
  ENDURANCE: "endurance",
  YOYO: "yoyo",
  TECHNICAL: "technical",
};

/**
 * Estados de asistencia
 */
export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  EXCUSED: "excused",
};

/**
 * Géneros
 */
export const GENDER_OPTIONS = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
  { value: "O", label: "Otro" },
];

/**
 * Categorías deportivas por edad
 */
export const SPORT_CATEGORIES = [
  { value: "sub8", label: "Sub-8", minAge: 6, maxAge: 8 },
  { value: "sub10", label: "Sub-10", minAge: 8, maxAge: 10 },
  { value: "sub12", label: "Sub-12", minAge: 10, maxAge: 12 },
  { value: "sub14", label: "Sub-14", minAge: 12, maxAge: 14 },
  { value: "sub16", label: "Sub-16", minAge: 14, maxAge: 16 },
  { value: "sub18", label: "Sub-18", minAge: 16, maxAge: 18 },
];

// ==============================================
//? CONFIGURACIÓN DE FECHAS

export const DATE_FORMATS = {
  SHORT: "DD/MM/YYYY",
  LONG: "DD [de] MMMM [de] YYYY",
  WITH_TIME: "DD/MM/YYYY HH:mm",
  ISO: "YYYY-MM-DD",
  TIME_ONLY: "HH:mm",
};

// ==============================================
//? CONFIGURACIÓN DE API

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    ME: "/auth/me",
  },

  // Users
  USERS: {
    BASE: "/users",
    BY_ID: (id) => `/users/${id}`,
  },

  // Athletes
  ATHLETES: {
    BASE: "/athletes",
    BY_ID: (id) => `/athletes/${id}`,
  },

  // Evaluations
  EVALUATIONS: {
    BASE: "/evaluations",
    BY_ID: (id) => `/evaluations/${id}`,
  },

  // Tests
  TESTS: {
    SPRINT: "/tests/sprint",
    ENDURANCE: "/tests/endurance",
    YOYO: "/tests/yoyo",
    TECHNICAL: "/tests/technical",
  },

  // Statistics
  STATISTICS: {
    BASE: "/statistics",
    BY_ATHLETE: (id) => `/statistics/athlete/${id}`,
  },

  // Attendance
  ATTENDANCE: {
    BASE: "/attendance",
    BY_DATE: (date) => `/attendance/date/${date}`,
  },
};
