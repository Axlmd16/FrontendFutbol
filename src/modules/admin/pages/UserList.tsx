import { useMemo, useState } from 'react';
import { useFetch } from '../../../core/hooks/useFetch';
import type { User } from '../../../core/types/user';
import { getUsers, getUsersByFilter } from '../services/users.service';

export function UserList() {
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);

  const queryKey = useMemo(() => ['users', roleFilter ?? 'all'], [roleFilter]);

  const { data, isLoading, error } = useFetch<User[]>(queryKey, () => {
    if (roleFilter) return getUsersByFilter({ role: roleFilter });
    return getUsers();
  });

  return (
    <section className="space-y-4">
      <header className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <select
          aria-label="Filtrar por rol"
          className="select select-bordered select-sm"
          value={roleFilter ?? ''}
          onChange={(e) => setRoleFilter(e.target.value || undefined)}
        >
          <option value="">Todos</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </header>

      {isLoading && <p>Cargando usuarios...</p>}
      {error && <p className="text-error">Error al cargar usuarios</p>}

      <div className="space-y-2">
        {data?.map((user) => (
          <article
            key={user.id}
            className="flex items-center justify-between rounded border p-3"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <span className="badge badge-neutral badge-sm">{user.role}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
