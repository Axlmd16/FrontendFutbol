import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UserCog,
    ClipboardList,
    Calendar,
    Activity,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import type { Role } from '../../core/types';

type NavItem = {
    label: string;
    path: string;
    icon: React.ReactNode;
    roles: Role[];
};

const navItems: NavItem[] = [
    {
        label: 'Dashboard',
        path: '/app/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        roles: ['Administrator', 'Coach'],
    },
    {
        label: 'Atletas',
        path: '/app/athletes',
        icon: <Users className="h-5 w-5" />,
        roles: ['Administrator', 'Coach'],
    },
    {
        label: 'Asistencia',
        path: '/app/attendance',
        icon: <Calendar className="h-5 w-5" />,
        roles: ['Administrator', 'Coach'],
    },
    {
        label: 'Evaluaciones',
        path: '/app/assessments',
        icon: <Activity className="h-5 w-5" />,
        roles: ['Administrator', 'Coach'],
    },
    {
        label: 'Usuarios',
        path: '/app/users',
        icon: <UserCog className="h-5 w-5" />,
        roles: ['Administrator'],
    },
    {
        label: 'Reportes',
        path: '/app/reports',
        icon: <ClipboardList className="h-5 w-5" />,
        roles: ['Administrator'],
    },
    {
        label: 'Configuración',
        path: '/app/settings',
        icon: <Settings className="h-5 w-5" />,
        roles: ['Administrator'],
    },
];

type SidebarProps = {
    userRole: Role;
    userName: string;
    userEmail: string;
    onLogout?: () => void;
};

export const Sidebar = ({ userRole, userName, userEmail, onLogout }: SidebarProps) => {
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const filteredItems = navItems.filter((item) => item.roles.includes(userRole));

    const isActive = (path: string) => location.pathname.startsWith(path);

    const NavContent = () => (
        <>
            {/* Logo / Brand */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-base-300">
                <div className="bg-primary text-primary-content rounded-lg p-2">
                    <Activity className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="font-bold text-lg">Futbol App</h1>
                    <p className="text-xs text-base-content/60">Panel de gestión</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="menu menu-md gap-1">
                    {filteredItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 ${isActive(item.path)
                                    ? 'active bg-primary text-primary-content'
                                    : 'hover:bg-base-200'
                                    }`}
                                onClick={() => setIsMobileOpen(false)}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User section */}
            <div className="border-t border-base-300 p-4">
                <div className="dropdown dropdown-top w-full">
                    <div
                        tabIndex={0}
                        role="button"
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 cursor-pointer w-full"
                    >
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-10">
                                <span className="text-sm font-medium">
                                    {userName
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                            <p className="font-medium text-sm truncate">{userName}</p>
                            <p className="text-xs text-base-content/60 truncate">{userEmail}</p>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-60" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-50 w-full p-2 shadow-lg border border-base-300 mb-2"
                    >
                        <li>
                            <span className="text-xs text-base-content/60 pointer-events-none">
                                {userRole === 'Administrator' ? 'Administrador' : 'Entrenador'}
                            </span>
                        </li>
                        <li>
                            <button onClick={onLogout} className="text-error">
                                <LogOut className="h-4 w-4" />
                                Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 btn btn-circle btn-ghost bg-base-100 shadow-md"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-40
                    w-64 bg-base-100 border-r border-base-300
                    flex flex-col
                    transform transition-transform duration-200 ease-in-out
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <NavContent />
            </aside>
        </>
    );
};

export default Sidebar;
