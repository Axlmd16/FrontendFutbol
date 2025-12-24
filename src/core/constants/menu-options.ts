import type { Role } from '../types';

export type MenuItem = {
    label: string;
    path: string;
    icon: string;
    roles: Role[];
};

export const MENU_ITEMS: MenuItem[] = [
    {
        label: 'Dashboard',
        path: '/app/dashboard',
        icon: 'LayoutDashboard',
        roles: ['Administrator', 'Coach'],
    },
    {
        label: 'Atletas',
        path: '/app/athletes',
        icon: 'Users',
        roles: ['Administrator', 'Coach'],
    },
    {
        label: 'Asistencia',
        path: '/app/attendance',
        icon: 'Calendar',
        roles: ['Administrator', 'Coach'],
    },
    {
        label: 'Evaluaciones',
        path: '/app/assessments',
        icon: 'Activity',
        roles: ['Administrator', 'Coach'],
    },
    {
        label: 'Usuarios',
        path: '/app/users',
        icon: 'UserCog',
        roles: ['Administrator'],
    },
    {
        label: 'Reportes',
        path: '/app/reports',
        icon: 'ClipboardList',
        roles: ['Administrator'],
    },
    {
        label: 'Configuración',
        path: '/app/settings',
        icon: 'Settings',
        roles: ['Administrator'],
    },
];