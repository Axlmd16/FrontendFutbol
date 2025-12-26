import React from "react";
import Button from "../../../shared/components/Button";
import { CirclePower, UserRoundPen } from "lucide-react";
import { ROLE_OPTIONS } from "../../../app/config/roles";
import PropTypes from "prop-types";

function UserTable({ users = [], onEdit, onDelete, loading = false }) {
  // Función auxiliar para obtener etiqueta de rol
  const getRoleLabel = (role) => {
    const roleOption = ROLE_OPTIONS.find((opt) => opt.value === role);
    return roleOption?.label || role;
  };

  // Función auxiliar para colores
  const getRoleBadgeColor = (role) => {
    const colors = {
      Administrator: "badge badge-primary",
      Coach: "badge badge-info",
      Intern: "badge badge-success",
    };
    return colors[role] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  // Estado de carga o vacío
  if (!loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full p-10 mt-6 bg-base-100 rounded-xl shadow-sm border border-base-200">
        <div className="bg-base-200 p-4 rounded-full mb-4">
          <svg
            className="h-8 w-8 text-base-content/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-base-content">
          No hay usuarios
        </h3>
        <p className="text-sm text-base-content/60 mt-1">
          Comienza creando un nuevo registro en el sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      <div className="overflow-x-auto bg-base-100 rounded-xl shadow-sm border border-base-200">
        <table className="table w-full align-middle">
          {/* HEAD */}
          <thead className="bg-base-200/30 text-base-content uppercase text-xs font-semibold">
            <tr>
              <th className="w-12">
                <label>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm rounded-md"
                  />
                </label>
              </th>
              <th className="text-left min-w-[250px]">Usuario</th>
              <th className="text-left">Identificación</th>
              <th className="text-center">Rol</th>
              <th className="text-center">Estado</th>
              <th className="text-right pr-6">Acciones</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-none"
              >
                {/* Checkbox */}
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm rounded-md"
                    />
                  </label>
                </th>

                {/* Usuario (Avatar + Info) */}
                <td>
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="mask mask-squircle w-10 h-10 bg-base-300">
                        <img
                          src={user.photo || "public/img/user.png"}
                          alt={user.full_name}
                          className="object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-base-content text-sm">
                        {user.full_name}
                      </span>
                      <span className="text-xs text-base-content/50">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Identificación */}
                <td className="font-mono text-sm text-base-content/80">
                  {user.dni || (
                    <span className="text-base-content/30 italic">
                      No registrado
                    </span>
                  )}
                </td>

                {/* Rol */}
                <td className="text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </td>

                {/* Estado */}
                <td className="text-center">
                  {user.is_active ? (
                    <div className="badge badge-success badge-sm gap-2 text-white/90">
                      Activo
                    </div>
                  ) : (
                    <div className="badge badge-error badge-sm gap-2 text-white/90">
                      Inactivo
                    </div>
                  )}
                </td>

                {/* Acciones */}
                <td className="text-right pr-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm" // DaisyUI btn-sm
                      className="btn-square btn-ghost text-info hover:bg-info/10"
                      onClick={() => onEdit(user)}
                      title="Editar usuario"
                    >
                      <UserRoundPen size={18} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="btn-square btn-ghost text-error hover:bg-error/10"
                      onClick={() => onDelete && onDelete(user)}
                      title="Desactivar/Eliminar usuario"
                    >
                      <CirclePower size={18} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Validación de PropTypes
UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      full_name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      dni: PropTypes.string,
      role: PropTypes.string.isRequired,
      is_active: PropTypes.bool.isRequired,
      photo: PropTypes.string,
    })
  ),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default UserTable;
