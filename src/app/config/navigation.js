/**
 * Navegación (Sidebar) por rol
 */

import { ROUTES } from './constants';
import { ROLES } from './roles';

export const getRoleLabel = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return 'Administrador';
    case ROLES.ENTRENADOR:
      return 'Entrenador';
    case ROLES.PASANTE:
      return 'Pasante';
    case ROLES.DEPORTISTA:
      return 'Deportista';
    case ROLES.REPRESENTANTE:
      return 'Representante';
    default:
      return 'Usuario';
  }
};

const baseItems = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD },
];

export const getSidebarItems = (role) => {
  // Nota: esto define qué links se muestran; las rutas igual se protegen con RoleRoute.
  if (role === ROLES.ADMIN) {
    return [
      ...baseItems,
      { label: 'Usuarios', to: ROUTES.USERS },
      { label: 'Inscripciones', to: ROUTES.INSCRIPTION_DEPORTISTA },
      { label: 'Evaluaciones', to: ROUTES.EVALUATIONS },
      { label: 'Estadísticas', to: ROUTES.STATISTICS },
      { label: 'Reportes', to: ROUTES.REPORTS },
    ];
  }

  if (role === ROLES.ENTRENADOR) {
    return [
      ...baseItems,
      { label: 'Inscripciones', to: ROUTES.INSCRIPTION_DEPORTISTA },
      { label: 'Evaluaciones', to: ROUTES.EVALUATIONS },
      { label: 'Estadísticas', to: ROUTES.STATISTICS },
      { label: 'Reportes', to: ROUTES.REPORTS },
    ];
  }

  if (role === ROLES.PASANTE) {
    return [
      ...baseItems,
      { label: 'Estadísticas', to: ROUTES.STATISTICS },
      { label: 'Reportes', to: ROUTES.REPORTS },
    ];
  }

  if (role === ROLES.REPRESENTANTE) {
    return [
      ...baseItems,
      { label: 'Inscripciones', to: ROUTES.INSCRIPTION_MENOR },
      { label: 'Estadísticas', to: ROUTES.STATISTICS },
      { label: 'Reportes', to: ROUTES.REPORTS },
    ];
  }

  if (role === ROLES.DEPORTISTA) {
    return [
      ...baseItems,
      { label: 'Estadísticas', to: ROUTES.STATISTICS },
      { label: 'Reportes', to: ROUTES.REPORTS },
    ];
  }

  return baseItems;
};
