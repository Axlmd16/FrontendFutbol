/**
 * Navegación (Sidebar) por rol
 */

import { ChartNoAxesCombined, FileText, LayoutGrid, LogOut, NotepadText, UserPlus2, Users2 } from 'lucide-react';
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

/** Iconos SVG inline para el sidebar */
export const NAV_ICONS = {
  dashboard: (
    <LayoutGrid size={16} />
  ),
  users: (
    <Users2 size={16} />
  ),
  inscription: (
    <UserPlus2 size={16} />
  ),
  evaluations: (
    <NotepadText size={16} />
  ),
  statistics: (
    <ChartNoAxesCombined size={16} />
  ),
  reports: (
    <FileText size={16} />
  ),
  logout: (
    <LogOut size={16} />
  ),
};

const baseItems = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: 'dashboard' },
];

export const getSidebarItems = (role) => {
  // Nota: esto define qué links se muestran; las rutas igual se protegen con RoleRoute.
  if (role === ROLES.ADMIN) {
    return [
      ...baseItems,
      { label: 'Usuarios', to: ROUTES.USERS, icon: 'users' },
      { label: 'Inscripciones', to: ROUTES.INSCRIPTION_DEPORTISTA, icon: 'inscription' },
      { label: 'Evaluaciones', to: ROUTES.EVALUATIONS, icon: 'evaluations' },
      { label: 'Estadísticas', to: ROUTES.STATISTICS, icon: 'statistics' },
      { label: 'Reportes', to: ROUTES.REPORTS, icon: 'reports' },
    ];
  }

  if (role === ROLES.ENTRENADOR) {
    return [
      ...baseItems,
      { label: 'Inscripciones', to: ROUTES.INSCRIPTION_DEPORTISTA, icon: 'inscription' },
      { label: 'Evaluaciones', to: ROUTES.EVALUATIONS, icon: 'evaluations' },
      { label: 'Estadísticas', to: ROUTES.STATISTICS, icon: 'statistics' },
      { label: 'Reportes', to: ROUTES.REPORTS, icon: 'reports' },
    ];
  }

  if (role === ROLES.PASANTE) {
    return [
      ...baseItems,
      { label: 'Estadísticas', to: ROUTES.STATISTICS, icon: 'statistics' },
      { label: 'Reportes', to: ROUTES.REPORTS, icon: 'reports' },
    ];
  }

  if (role === ROLES.REPRESENTANTE) {
    return [
      ...baseItems,
      { label: 'Inscripciones', to: ROUTES.INSCRIPTION_MENOR, icon: 'inscription' },
      { label: 'Estadísticas', to: ROUTES.STATISTICS, icon: 'statistics' },
      { label: 'Reportes', to: ROUTES.REPORTS, icon: 'reports' },
    ];
  }

  if (role === ROLES.DEPORTISTA) {
    return [
      ...baseItems,
      { label: 'Estadísticas', to: ROUTES.STATISTICS, icon: 'statistics' },
      { label: 'Reportes', to: ROUTES.REPORTS, icon: 'reports' },
    ];
  }

  return baseItems;
};
