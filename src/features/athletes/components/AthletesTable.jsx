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
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body flex flex-col items-center justify-center py-12">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <User size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            No hay deportistas
          </h3>
          <p className="text-sm text-slate-500 mt-1 text-center max-w-sm">
            No se encontraron deportistas con los filtros seleccionados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-slate-50/80">
            <tr className="border-b border-base-200">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pl-6">
                Deportista
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                Estamento
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                Sexo
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                Estado
              </th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pr-6">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200/60">
            {athletes.map((athlete) => (
              <tr
                key={athlete.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                {/* Deportista Info */}
                <td className="py-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary/20 to-primary/5 ring-2 ring-base-200">
                        {athlete.photo ? (
                          <img
                            src={athlete.photo}
                            alt={athlete.full_name}
                            className="object-cover rounded-full"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-sm font-bold text-primary">
                            {athlete.full_name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 text-sm">
                        {athlete.full_name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {athlete.dni || "Sin documento"}
                      </span>
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
