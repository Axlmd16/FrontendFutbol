/**
 * Configuración de Roles y Permisos
 * 
 * Define los roles del sistema y sus permisos asociados.
 */

/**
 * Enumeración de roles disponibles en el sistema
 * Usar estas constantes en lugar de strings para evitar errores de tipeo
 */
export const ROLES = {
  ADMIN: 'admin',
  ENTRENADOR: 'entrenador',
  PASANTE: 'pasante',
  DEPORTISTA: 'deportista',
  REPRESENTANTE: 'representante',
  INVITADO: 'invitado',
};

/**
 * Configuración de permisos por rol
 * Define qué acciones puede realizar cada rol
 */
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canManageUsers: true,
    canManageInscriptions: true,
    canViewReports: true,
    canCreateEvaluations: true,
    canEditEvaluations: true,
    canDeleteEvaluations: true,
    canViewStatistics: true,
    canExportData: true,
    canManageSettings: true,
  },
  [ROLES.ENTRENADOR]: {
    canManageUsers: false,
    canManageInscriptions: true,
    canViewReports: true,
    canCreateEvaluations: true,
    canEditEvaluations: true,
    canDeleteEvaluations: false,
    canViewStatistics: true,
    canExportData: true,
    canManageSettings: false,
  },
  [ROLES.PASANTE]: {
    canManageUsers: false,
    canManageInscriptions: false,
    canViewReports: true,
    canCreateEvaluations: false,
    canEditEvaluations: false,
    canDeleteEvaluations: false,
    canViewStatistics: true,
    canExportData: true,
    canManageSettings: false,
  },
  [ROLES.DEPORTISTA]: {
    canManageUsers: false,
    canManageInscriptions: false,
    canViewReports: true,
    canCreateEvaluations: false,
    canEditEvaluations: false,
    canDeleteEvaluations: false,
    canViewStatistics: true,
    canExportData: false,
    canManageSettings: false,
  },
  [ROLES.REPRESENTANTE]: {
    canManageUsers: false,
    canManageInscriptions: true,
    canViewReports: true,
    canCreateEvaluations: false,
    canEditEvaluations: false,
    canDeleteEvaluations: false,
    canViewStatistics: true,
    canExportData: true,
    canManageSettings: false,
  },
  [ROLES.INVITADO]: {
    canManageUsers: false,
    canManageInscriptions: false,
    canViewReports: false,
    canCreateEvaluations: false,
    canEditEvaluations: false,
    canDeleteEvaluations: false,
    canViewStatistics: false,
    canExportData: false,
    canManageSettings: false,
  },
};

/**
 * Rutas accesibles por rol
 * Define qué rutas puede acceder cada rol
 */
export const ROLE_ROUTES = {
  [ROLES.ADMIN]: [
    '/dashboard',
    '/users',
    '/users/create',
    '/users/edit',
    '/inscription',
    '/inscription/deportista',
    '/inscription/menor',
    '/seguimiento',
    '/seguimiento/evaluations',
    '/seguimiento/statistics',
    '/seguimiento/reports',
    '/settings',
  ],
  [ROLES.ENTRENADOR]: [
    '/dashboard',
    '/inscription',
    '/inscription/deportista',
    '/inscription/menor',
    '/seguimiento',
    '/seguimiento/evaluations',
    '/seguimiento/statistics',
    '/seguimiento/reports',
  ],
  [ROLES.PASANTE]: [
    '/dashboard',
    '/seguimiento/statistics',
    '/seguimiento/reports',
  ],
  [ROLES.DEPORTISTA]: [
    '/dashboard',
    '/profile',
    '/seguimiento/statistics',
    '/seguimiento/reports',
  ],
  [ROLES.REPRESENTANTE]: [
    '/dashboard',
    '/inscription',
    '/inscription/menor',
    '/seguimiento/statistics',
    '/seguimiento/reports',
  ],
  [ROLES.INVITADO]: [
    '/dashboard',
  ],
};

/**
 * Verifica si un rol tiene acceso a una ruta específica
 */
export const hasRouteAccess = (role, path) => {
  if (!role || !path) return false;
  const allowedRoutes = ROLE_ROUTES[role] || [];
  return allowedRoutes.some(route => path.startsWith(route));
};

/**
 * Verifica si un rol tiene un permiso específico
 */
export const hasPermission = (role, permission) => {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions?.[permission] === true;
};

/**
 * Obtiene todos los permisos de un rol
 */
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || {};
};

/**
 * Lista de roles para mostrar en selectores
 */
export const ROLE_OPTIONS = [
  { value: ROLES.ADMIN, label: 'Administrador' },
  { value: ROLES.ENTRENADOR, label: 'Entrenador' },
  { value: ROLES.PASANTE, label: 'Pasante' },
  { value: ROLES.DEPORTISTA, label: 'Deportista' },
  { value: ROLES.REPRESENTANTE, label: 'Representante' },
  { value: ROLES.INVITADO, label: 'Invitado' },
];
