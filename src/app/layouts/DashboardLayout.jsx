/**
 * Layout protegido con Sidebar colapsable y responsive
 * Diseño profesional y minimalista
 */

import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import useAuth from '@/features/auth/hooks/useAuth';
import { getRoleLabel, getSidebarItems, NAV_ICONS } from '@/app/config/navigation.jsx';
import { ROUTES } from '@/app/config/constants';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role || user?.rol;
  const roleLabel = getRoleLabel(role);
  const items = getSidebarItems(role);

  const sidebarWidth = collapsed ? 'w-16' : 'w-64';

  const goToProfile = () => {
    navigate(ROUTES.PROFILE);
    if (mobileOpen) setMobileOpen(false);
  };

  /** Contenido del sidebar (reutilizado en desktop y mobile) */
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex h-full flex-col bg-base-100">
      {/* Header */}
      <div className="border-b border-base-300 px-4 py-5">
        <div className="flex items-center justify-between">
          {(!collapsed || isMobile) && (
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex size-10 shrink-0 items-center justify-center bg-neutral text-neutral-content font-bold text-lg">
                K
              </div>
              <div className="min-w-0">
                <div className="text-base font-bold tracking-tight text-base-content">
                  KALLPA UNL
                </div>
                <div className="text-xs font-medium text-base-content/50 uppercase tracking-wide mt-0.5">
                  {roleLabel}
                </div>
              </div>
            </div>
          )}
          {collapsed && !isMobile && (
            <div className="flex size-10 items-center justify-center bg-neutral text-neutral-content font-bold text-lg mx-auto">
              K
            </div>
          )}
          {isMobile && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="btn btn-ghost btn-sm btn-square"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* User Profile Photo & Info - Solo cuando está expandido */}
      {(!collapsed || isMobile) && (
        <div className="border-b border-base-300 px-4 py-6 bg-base-200/30">
          <div className="flex flex-col items-center gap-3">
            {/* Profile Photo - Clickeable */}
            <button
              type="button"
              onClick={goToProfile}
              className="relative group cursor-pointer focus:outline-none"
              title="Ver mi perfil"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name || user.email || 'Usuario'}
                  className="size-24 object-cover border-4 border-base-100 shadow-lg group-hover:border-primary transition-colors"
                  style={{ borderRadius: '50%' }}
                />
              ) : (
                <div className="flex size-24 items-center justify-center bg-neutral text-neutral-content border-4 border-base-100 shadow-lg font-bold text-3xl group-hover:border-primary transition-colors"
                     style={{ borderRadius: '50%' }}>
                  {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                   style={{ borderRadius: '50%' }}>
                <span className="text-white text-xs font-medium">Ver perfil</span>
              </div>
            </button>

            {/* User info */}
            <div className="text-center w-full">
              {user?.name && (
                <div className="font-bold text-sm text-base-content truncate px-2">
                  {user.name}
                </div>
              )}
              {user?.email && (
                <div className="text-xs font-medium text-base-content/70 truncate px-2 mt-1">
                  {user.email}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5 px-2">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={() => isMobile && setMobileOpen(false)}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors',
                    'border-l-4',
                    isActive
                      ? 'bg-primary/10 text-primary border-primary'
                      : 'text-base-content/70 hover:text-base-content hover:bg-base-200/50 border-transparent',
                    collapsed && !isMobile ? 'justify-center px-0' : '',
                  ].join(' ')
                }
                end={item.to === '/dashboard'}
                title={collapsed && !isMobile ? item.label : undefined}
              >
                <span className={collapsed && !isMobile ? '' : 'ml-1'}>
                  {NAV_ICONS[item.icon] || NAV_ICONS.dashboard}
                </span>
                {(!collapsed || isMobile) && (
                  <span className="tracking-wide">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer - Profile (collapsed) & Logout */}
      <div className="border-t border-base-300 p-2">
        {/* Profile button - Solo cuando está colapsado */}
        {collapsed && !isMobile && (
          <div className="mb-2 flex justify-center">
            <button
              type="button"
              onClick={goToProfile}
              className="relative group cursor-pointer focus:outline-none"
              title={user?.name || user?.email || 'Ver mi perfil'}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name || user.email || 'Usuario'}
                  className="size-10 object-cover border-2 border-base-300 group-hover:border-primary transition-colors"
                  style={{ borderRadius: '50%' }}
                />
              ) : (
                <div className="flex size-10 items-center justify-center bg-neutral text-neutral-content border-2 border-base-300 group-hover:border-primary transition-colors font-bold text-sm"
                     style={{ borderRadius: '50%' }}>
                  {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                </div>
              )}
              {/* Status indicator */}
              <div className="absolute bottom-0 right-0 size-3 bg-success border-2 border-base-100"
                   style={{ borderRadius: '50%' }}></div>
            </button>
          </div>
        )}

        {/* Logout button */}
        <button
          type="button"
          onClick={logout}
          title={collapsed && !isMobile ? 'Cerrar sesión' : undefined}
          className={[
            'flex w-full items-center gap-3 px-3 py-3 text-sm font-medium transition-colors',
            'text-error hover:bg-error/10 border-l-4 border-transparent hover:border-error',
            collapsed && !isMobile ? 'justify-center px-0' : '',
          ].join(' ')}
        >
          <span className={collapsed && !isMobile ? '' : 'ml-1'}>
            {NAV_ICONS.logout}
          </span>
          {(!collapsed || isMobile) && (
            <span className="tracking-wide">Cerrar sesión</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-base-300 bg-base-100 px-4 shadow-sm lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="btn btn-ghost btn-sm btn-square"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center bg-neutral text-neutral-content font-bold text-base">
            K
          </div>
          <span className="font-bold tracking-tight">KALLPA UNL</span>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-72 bg-base-100 shadow-2xl transition-transform duration-300 lg:hidden',
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
            className="absolute -right-3 top-24 flex size-6 items-center justify-center border border-base-300 bg-base-100 shadow-md hover:bg-base-200 hover:shadow-lg transition-all"
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </aside>

        {/* Main content */}
        <main
          className={[
            'min-h-screen flex-1 transition-all duration-300',
            collapsed ? 'lg:ml-16' : 'lg:ml-64',
          ].join(' ')}
        >
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;