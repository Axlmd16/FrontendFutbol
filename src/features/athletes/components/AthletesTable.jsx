import PropTypes from "prop-types";
import Button from "@/shared/components/Button";
import { Edit2, Power, MoreHorizontal, User } from "lucide-react";

function AthletesTable({
  athletes = [],
  onEdit,
  onDeactivate,
  loading = false,
}) {
  // Badge estilos por categoría
  const getCategoryBadge = (category) => {
    const styles = {
      SUB10: "badge-primary",
      SUB12: "badge-secondary",
      SUB14: "badge-info",
      SUB16: "badge-accent",
      SUB18: "badge-warning",
      ADULTO: "badge-success",
    };
    return styles[category] || "badge-neutral";
  };

  // Estado vacío
  if (!loading && athletes.length === 0) {
    return (
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body items-center text-center py-16">
          <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4">
            <User size={32} className="text-base-content/40" />
          </div>
          <h3 className="text-lg font-semibold text-base-content">
            No hay deportistas
          </h3>
          <p className="text-base-content/60 text-sm max-w-sm">
            No se encontraron deportistas con los filtros seleccionados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-white shadow-md border border-base-300 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70">
                Deportista
              </th>
              <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70 text-center">
                Categoría
              </th>
              <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70 text-center">
                Sexo
              </th>
              <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70 text-center">
                Estado
              </th>
              <th className="text-xs uppercase tracking-wider font-semibold text-base-content/70 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete) => (
              <tr key={athlete.id} className="hover">
                {/* Deportista Info */}
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full bg-primary/10 ring-2 ring-base-200">
                        {athlete.photo ? (
                          <img
                            src={athlete.photo}
                            alt={athlete.full_name}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary font-semibold">
                            {athlete.full_name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-base-content truncate">
                        {athlete.full_name}
                      </div>
                      <div className="text-xs text-base-content/50 truncate">
                        {athlete.email || "Sin email registrado"}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Categoría */}
                <td className="text-center">
                  <span
                    className={`badge ${getCategoryBadge(
                      athlete.category
                    )} badge-sm`}
                  >
                    {athlete.category}
                  </span>
                </td>

                {/* Sexo */}
                <td className="text-center">
                  <span
                    className={`badge badge-outline badge-sm ${
                      athlete.sex === "M" ? "badge-info" : "badge-secondary"
                    }`}
                  >
                    {athlete.sex === "M" ? "Masculino" : "Femenino"}
                  </span>
                </td>

                {/* Estado */}
                <td className="text-center">
                  <span
                    className={`badge badge-sm ${
                      athlete.state ? "badge-success" : "badge-error"
                    }`}
                  >
                    {athlete.state ? "Activo" : "Inactivo"}
                  </span>
                </td>

                {/* Acciones */}
                <td>
                  <div className="flex justify-end gap-1">
                    <button
                      className="btn btn-ghost btn-sm btn-square tooltip tooltip-left"
                      data-tip="Editar"
                      onClick={() => onEdit && onEdit(athlete)}
                    >
                      <Edit2 size={16} className="text-primary" />
                    </button>
                    <div className="dropdown dropdown-end">
                      <button
                        tabIndex={0}
                        className="btn btn-ghost btn-sm btn-square"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-48 border border-base-300"
                      >
                        <li>
                          <button
                            onClick={() => onEdit && onEdit(athlete)}
                            className="text-base-content"
                          >
                            <Edit2 size={14} />
                            Editar deportista
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => onDeactivate(athlete)}
                            disabled={!athlete.state}
                            className="text-error disabled:opacity-50"
                          >
                            <Power size={14} />
                            Dar de baja
                          </button>
                        </li>
                      </ul>
                    </div>
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
