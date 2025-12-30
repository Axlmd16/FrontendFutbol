import React from "react";
import Button from "../../../shared/components/Button";
import { CirclePower, UserRoundPen } from "lucide-react";
import PropTypes from "prop-types";

function AthletesTable({
  athletes = [],
  onEdit,
  onDeactivate,
  loading = false,
}) {
  // Función auxiliar para obtener badge de categoría
  const getCategoryBadge = (category) => {
    const badges = {
      SUB10: "badge badge-primary",
      SUB12: "badge badge-secondary",
      SUB14: "badge badge-info",
      SUB16: "badge badge-accent",
      SUB18: "badge badge-warning",
      ADULTO: "badge badge-success",
    };
    return badges[category] || "badge badge-neutral";
  };

  // Función auxiliar para obtener badge de sexo
  const getSexBadge = (sex) => {
    const badges = {
      M: "badge badge-info",
      F: "badge badge-secondary",
    };
    return badges[sex] || "badge badge-neutral";
  };

  // Función auxiliar para obtener badge de estado
  const getStatusBadge = (status) => {
    if (status) {
      return "badge badge-success";
    }
    return "badge badge-error";
  };

  const getStatusLabel = (status) => {
    return status ? "Activo" : "Inactivo";
  };

  // Estado de carga o vacío
  if (!loading && athletes.length === 0) {
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
          No hay deportistas
        </h3>
        <p className="text-sm text-base-content/60 mt-1">
          No se encontraron deportistas activos en tu club.
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
              <th className="text-left min-w-[250px]">Deportista</th>
              <th className="text-center">Categoría</th>
              <th className="text-center">Sexo</th>
              <th className="text-center">Estado</th>
              <th className="text-right pr-6">Acciones</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {athletes.map((athlete) => (
              <tr
                key={athlete.id}
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

                {/* Deportista (Avatar + Info) */}
                <td>
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="mask mask-squircle w-10 h-10 bg-base-300">
                        <img
                          src={athlete.photo || "/public/img/user.png"}
                          alt={athlete.full_name}
                          onError={(e) => {
                            e.target.src = "/public/img/user.png";
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-base-content">
                        {athlete.full_name}
                      </div>
                      <div className="text-xs text-base-content/60">
                        {athlete.email || "Sin email"}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Categoría */}
                <td className="text-center">
                  <span className={getCategoryBadge(athlete.category)}>
                    {athlete.category}
                  </span>
                </td>

                {/* Sexo */}
                <td className="text-center">
                  <span className={getSexBadge(athlete.sex)}>
                    {athlete.sex === "M" ? "Masculino" : "Femenino"}
                  </span>
                </td>

                {/* Estado */}
                <td className="text-center">
                  <span className={getStatusBadge(athlete.state)}>
                    {getStatusLabel(athlete.state)}
                  </span>
                </td>

                {/* Acciones */}
                <td>
                  <div className="flex justify-end gap-2 pr-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="btn-square btn-ghost text-info hover:bg-info/10"
                      onClick={() => onEdit && onEdit(athlete)}
                      title="Editar deportista"
                    >
                      <UserRoundPen size={16} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDeactivate(athlete)}
                      disabled={!athlete.state}
                      className="btn-sm"
                    >
                      <CirclePower size={16} />
                      Dar de Baja
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

AthletesTable.propTypes = {
  athletes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      full_name: PropTypes.string.isRequired,
      email: PropTypes.string,
      photo: PropTypes.string,
      category: PropTypes.string,
      sex: PropTypes.string,
      state: PropTypes.bool,
    })
  ),
  onEdit: PropTypes.func.isRequired,
  onDeactivate: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default AthletesTable;
