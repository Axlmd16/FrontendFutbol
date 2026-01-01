import PropTypes from "prop-types";
import Button from "@/shared/components/Button";
import {
  User,
  UserRoundPen,
  CirclePower,
  IdCard,
  GraduationCap,
  Briefcase,
  BookOpen,
  Users,
  UserX,
  CheckCircle2,
  XCircle,
  Mars,
  Venus,
  CircleHelp,
  Eye,
} from "lucide-react";

function AthletesTable({
  athletes = [],
  onEdit,
  onDelete,
  onViewDetail,
  loading = false,
}) {
  // Badge estilos e iconos por estamento (type_athlete)
  const getEstamentoConfig = (typeAthlete) => {
    const configs = {
      administrativos: {
        class: "badge-primary",
        icon: Briefcase,
        label: "Administrativos",
      },
      docentes: {
        class: "badge-secondary",
        icon: BookOpen,
        label: "Docentes",
      },
      estudiantes: {
        class: "badge-info",
        icon: GraduationCap,
        label: "Estudiantes",
      },
      trabajadores: {
        class: "badge-accent",
        icon: Users,
        label: "Trabajadores",
      },
      externos: {
        class: "badge-warning",
        icon: UserX,
        label: "Externos",
      },
    };
    const key = (typeAthlete || "").toLowerCase();
    return configs[key] || { class: "badge-neutral", icon: User, label: "N/A" };
  };

  // Config de sexo con iconos
  const getSexConfig = (sex) => {
    const configs = {
      Male: { label: "Masculino", class: "badge-info", icon: Mars },
      Female: { label: "Femenino", class: "badge-secondary", icon: Venus },
      Other: { label: "Otro", class: "badge-neutral", icon: CircleHelp },
    };
    return (
      configs[sex] || {
        label: sex || "N/A",
        class: "badge-neutral",
        icon: CircleHelp,
      }
    );
  };

  // Estado vacío mejorado
  if (!loading && athletes.length === 0) {
    return (
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body items-center text-center py-16">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
            <User size={40} className="text-primary/60" />
          </div>
          <h3 className="text-xl font-bold text-base-content">
            No hay deportistas
          </h3>
          <p className="text-base-content/60 text-sm max-w-md">
            No se encontraron deportistas con los filtros seleccionados. Intenta
            con otros criterios de búsqueda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-white shadow-lg border border-base-300 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-linear-to-r from-base-200 to-base-300">
            <tr>
              <th className="text-xs uppercase tracking-wider font-bold text-base-content/80">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  Deportista
                </div>
              </th>
              <th className="text-xs uppercase tracking-wider font-bold text-base-content/80 text-center">
                <div className="flex items-center justify-center gap-2">
                  <GraduationCap size={14} />
                  Estamento
                </div>
              </th>
              <th className="text-xs uppercase tracking-wider font-bold text-base-content/80 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users size={14} />
                  Sexo
                </div>
              </th>
              <th className="text-xs uppercase tracking-wider font-bold text-base-content/80 text-center">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={14} />
                  Estado
                </div>
              </th>
              <th className="text-xs uppercase tracking-wider font-bold text-base-content/80 text-right pr-6">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete, index) => (
              <tr
                key={athlete.id}
                className={`hover:bg-base-100 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-base-50"
                }`}
              >
                {/* Deportista Info */}
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div
                        className={`w-12 h-12 rounded-full ring-2 flex items-center justify-center ${
                          athlete.is_active
                            ? "bg-linear-to-br from-primary/20 to-primary/10 ring-primary/30"
                            : "bg-base-200 ring-base-300"
                        }`}
                      >
                        {athlete.photo ? (
                          <img
                            src={athlete.photo}
                            alt={athlete.full_name}
                            className="rounded-full"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <span
                            className={`text-lg font-bold ${
                              athlete.is_active
                                ? "text-primary"
                                : "text-base-content/40"
                            }`}
                          >
                            {athlete.full_name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`font-semibold truncate ${
                          athlete.is_active
                            ? "text-base-content"
                            : "text-base-content/50"
                        }`}
                      >
                        {athlete.full_name}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-base-content/50">
                        <IdCard size={12} />
                        <span className="truncate">
                          {athlete.dni || "Sin documento"}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Estamento con icono */}
                <td className="text-center">
                  {(() => {
                    const config = getEstamentoConfig(athlete.type_athlete);
                    const IconComponent = config.icon;
                    return (
                      <span
                        className={`badge ${config.class} badge-sm gap-1 font-medium`}
                      >
                        <IconComponent size={12} />
                        {config.label}
                      </span>
                    );
                  })()}
                </td>

                {/* Sexo con icono */}
                <td className="text-center">
                  {(() => {
                    const config = getSexConfig(athlete.sex);
                    const IconComponent = config.icon;
                    return (
                      <span
                        className={`badge badge-outline ${config.class} badge-sm gap-1`}
                      >
                        <IconComponent size={12} />
                        {config.label}
                      </span>
                    );
                  })()}
                </td>

                {/* Estado con icono */}
                <td className="text-center">
                  {athlete.is_active ? (
                    <span className="badge badge-success badge-sm gap-1 font-medium">
                      <CheckCircle2 size={12} />
                      Activo
                    </span>
                  ) : (
                    <span className="badge badge-error badge-sm gap-1 font-medium">
                      <XCircle size={12} />
                      Inactivo
                    </span>
                  )}
                </td>

                {/* Acciones */}
                <td className="text-right pr-4">
                  <div className="flex items-center justify-end gap-2">
                    <div
                      className="tooltip tooltip-left"
                      data-tip="Ver detalle"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="btn-square btn-ghost text-primary hover:bg-primary/10 hover:scale-105 transition-transform"
                        onClick={() => onViewDetail && onViewDetail(athlete)}
                      >
                        <Eye size={18} />
                      </Button>
                    </div>

                    <div className="tooltip tooltip-left" data-tip="Editar">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="btn-square btn-ghost text-info hover:bg-info/10 hover:scale-105 transition-transform"
                        onClick={() => onEdit && onEdit(athlete)}
                      >
                        <UserRoundPen size={18} />
                      </Button>
                    </div>

                    <div
                      className="tooltip tooltip-left"
                      data-tip={athlete.is_active ? "Dar de baja" : "Activar"}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`btn-square btn-ghost hover:scale-105 transition-transform ${
                          athlete.is_active
                            ? "text-warning hover:bg-warning/10"
                            : "text-success hover:bg-success/10"
                        }`}
                        onClick={() => onDelete && onDelete(athlete)}
                      >
                        <CirclePower size={18} />
                      </Button>
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
      dni: PropTypes.string,
      photo: PropTypes.string,
      type_athlete: PropTypes.string,
      sex: PropTypes.string,
      is_active: PropTypes.bool,
    })
  ),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewDetail: PropTypes.func,
  loading: PropTypes.bool,
};

export default AthletesTable;
