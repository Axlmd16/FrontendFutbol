/**
 * Layout protegido con Sidebar colapsable y responsive
 */

import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import useAuth from '@/features/auth/hooks/useAuth';
import { getRoleLabel, getSidebarItems, NAV_ICONS } from '@/app/config/navigation.jsx';

/** Iconos de control */
const MenuIcon = () => (
  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

const CloseIcon = () => (
  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role || user?.rol;
  const roleLabel = getRoleLabel(role);
  const items = getSidebarItems(role);

  const sidebarWidth = collapsed ? 'w-20' : 'w-64';

  /** Contenido del sidebar (reutilizado en desktop y mobile) */
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={`flex items-center border-b border-base-300 px-4 py-4 ${collapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
        {(!collapsed || isMobile) && (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-content font-bold">
                K
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">Kallpa UNL</div>
                <div className="truncate text-xs text-base-content/60">{roleLabel}</div>
              </div>
            </div>
          </div>
        )}
        {collapsed && !isMobile && (
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-content font-bold">
            K
          </div>
        )}
        {isMobile && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="btn btn-ghost btn-sm btn-square"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {/* User info (solo expandido) */}
      {(!collapsed || isMobile) && user?.email && (
        <div className="border-b border-base-300 px-4 py-3">
          <div className="truncate text-xs text-base-content/60">{user.email}</div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="menu menu-sm gap-1 p-0">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={() => isMobile && setMobileOpen(false)}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-content'
                      : 'text-base-content hover:bg-base-200',
                    collapsed && !isMobile ? 'justify-center' : '',
                  ].join(' ')
                }
                end={item.to === '/dashboard'}
                title={collapsed && !isMobile ? item.label : undefined}
              >
                {NAV_ICONS[item.icon] || NAV_ICONS.dashboard}
                {(!collapsed || isMobile) && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer - Logout */}
      <div className="border-t border-base-300 p-3">
        <button
          type="button"
          onClick={logout}
          title={collapsed && !isMobile ? 'Cerrar sesión' : undefined}
          className={[
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
            'text-error hover:bg-error/10',
            collapsed && !isMobile ? 'justify-center' : '',
          ].join(' ')}
        >
          {NAV_ICONS.logout}
          {(!collapsed || isMobile) && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-base-300 bg-base-100 px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="btn btn-ghost btn-sm btn-square"
        >
          <MenuIcon />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-content font-bold text-sm">
            K
          </div>
          <span className="font-semibold">Kallpa UNL</span>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-72 bg-base-100 shadow-xl transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <SidebarContent isMobile />
      </aside>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside
          className={[
            'fixed inset-y-0 left-0 z-30 hidden border-r border-base-300 bg-base-100 transition-all duration-300 lg:block',
            sidebarWidth,
          ].join(' ')}
        >
          <SidebarContent />

          {/* Collapse toggle button */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-20 flex size-6 items-center justify-center rounded-full border border-base-300 bg-base-100 shadow-sm hover:bg-base-200"
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </aside>

        {/* Main content */}
        <main
          className={[
            'min-h-screen flex-1 transition-all duration-300',
            'lg:ml-64',
            collapsed ? 'lg:ml-20' : 'lg:ml-64',
          ].join(' ')}
        >
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
