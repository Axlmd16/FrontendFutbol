/**
 * Layout protegido con Sidebar
 */

import { NavLink, Outlet } from 'react-router-dom';
import useAuth from '@/features/auth/hooks/useAuth';
import { getRoleLabel, getSidebarItems } from '@/app/config/navigation';

const linkBase =
  'flex items-center rounded-lg px-3 py-2 text-sm transition-colors';

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  const role = user?.role || user?.rol;
  const roleLabel = getRoleLabel(role);
  const items = getSidebarItems(role);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-4">
            <div className="text-base font-semibold text-gray-900">
              Kallpa UNL
            </div>
            <div className="mt-1 text-xs text-gray-500">{roleLabel}</div>
            {user?.email && (
              <div className="mt-1 truncate text-xs text-gray-500">
                {user.email}
              </div>
            )}
          </div>

          <nav className="p-3">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        linkBase,
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100',
                      ].join(' ')
                    }
                    end={item.to === '/dashboard'}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={logout}
                className={[
                  linkBase,
                  'w-full justify-start text-gray-700 hover:bg-gray-100',
                ].join(' ')}
              >
                Cerrar sesión
              </button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
