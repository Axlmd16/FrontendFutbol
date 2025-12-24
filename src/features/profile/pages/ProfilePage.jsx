/**
 * Página de Perfil de Usuario
 */

import useAuth from '@/features/auth/hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-base-content">Mi Perfil</h1>
        <p className="mt-1 text-sm text-base-content/60">
          Gestiona tu información personal y preferencias de cuenta.
        </p>
      </div>

      {/* Profile Card */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name || user.email || 'Usuario'}
                  className="size-32 object-cover border-4 border-base-200 shadow-lg"
                  style={{ borderRadius: '50%' }}
                />
              ) : (
                <div
                  className="flex size-32 items-center justify-center bg-neutral text-neutral-content border-4 border-base-200 shadow-lg font-bold text-4xl"
                  style={{ borderRadius: '50%' }}
                >
                  {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-base-content">
                {user?.name || 'Usuario'}
              </h2>
              <p className="text-sm text-base-content/60">{user?.email}</p>
              <div className="mt-2">
                <span className="badge badge-primary badge-sm">
                  {user?.role || user?.rol || 'Usuario'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section - Placeholder */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-lg">Información Personal</h3>
          <div className="divider my-2"></div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                Nombre completo
              </label>
              <p className="mt-1 text-base-content">{user?.name || '—'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                Correo electrónico
              </label>
              <p className="mt-1 text-base-content">{user?.email || '—'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                Teléfono
              </label>
              <p className="mt-1 text-base-content">{user?.phone || '—'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                Rol
              </label>
              <p className="mt-1 text-base-content capitalize">{user?.role || user?.rol || '—'}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="btn btn-primary btn-sm" disabled>
              Editar información
            </button>
          </div>
        </div>
      </div>

      {/* Security Section - Placeholder */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-lg">Seguridad</h3>
          <div className="divider my-2"></div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-base-content">Contraseña</p>
              <p className="text-sm text-base-content/60">
                Última actualización: No disponible
              </p>
            </div>
            <button className="btn btn-outline btn-sm" disabled>
              Cambiar contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
