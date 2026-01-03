/**
 * AthleteDetailPage
 *
 * Página de detalle de deportista con estadísticas individuales,
 * asistencia y tests realizados.
 * Usa TanStack Query para cache de datos.
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Activity,
  Calendar,
  ClipboardList,
  Zap,
  Heart,
  Dumbbell,
  Target,
  Trophy,
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Users,
  Phone,
  Mail,
  Pencil,
} from "lucide-react";
import {
  ROUTES,
  GENDER_OPTIONS,
  TEST_TYPE_LABELS,
} from "@/app/config/constants";
import {
  getPerformanceLevel,
  formatStatValue,
} from "@/shared/utils/performanceUtils";
import StatsHelpModal from "../components/StatsHelpModal";

// Hooks de estadísticas con cache
import {
  useAthleteInfo,
  useAthleteStats,
} from "@/features/seguimiento/hooks/useStatistics";

// Helper functions
const getGenderLabel = (sex) => {
  if (!sex) return "No especificado";
  const normalized = sex.toUpperCase();
  const found = GENDER_OPTIONS.find((g) => g.value === normalized);
  return found?.label || sex;
};

const getTestLabel = (testType) => TEST_TYPE_LABELS[testType]?.name || testType;

// Helper para obtener etiqueta de parentesco
const getRelationshipLabel = (relationship) => {
  if (!relationship) return "-";
  const normalized = relationship.toUpperCase();
  const labels = {
    FATHER: "Padre",
    MOTHER: "Madre",
    LEGAL_GUARDIAN: "Tutor Legal",
  };
  return labels[normalized] || relationship;
};

function AthleteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Queries con cache (5 minutos)
  const {
    data: athleteInfo,
    isLoading: infoLoading,
    isError: infoError,
    error: infoErrorData,
  } = useAthleteInfo(id);

  const { data: stats, isLoading: statsLoading } = useAthleteStats(id);

  const loading = infoLoading || statsLoading;
  const error = infoError ? infoErrorData?.message : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error || !athleteInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle size={48} className="text-error" />
        <p className="text-base-content/70">
          {error || "Atleta no encontrado"}
        </p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Volver
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => navigate(ROUTES.INSCRIPTION)}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              {athleteInfo.full_name}
            </h1>
            <p className="text-base-content/60">Detalle del deportista</p>
          </div>
          <div className="ml-auto">
            <span
              className={`badge ${
                athleteInfo.is_active ? "badge-success" : "badge-error"
              } gap-1`}
            >
              {athleteInfo.is_active ? (
                <CheckCircle size={14} />
              ) : (
                <XCircle size={14} />
              )}
              {athleteInfo.is_active ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        {/* Sections: General Info + Representative (side by side) */}
        <div
          className={`grid gap-4 ${
            athleteInfo.representative_id ? "lg:grid-cols-2" : ""
          }`}
        >
          {/* Section 1: General Info */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <h2 className="card-title text-base flex items-center gap-2 mb-4 pb-3 border-b border-base-200">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                Información del Deportista
              </h2>

              {athleteInfo.representative_id ? (
                // Layout compacto cuando hay representante
                <>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <p className="text-xs text-base-content/50 uppercase tracking-wider">
                        Nombre
                      </p>
                      <p className="font-medium text-sm">
                        {athleteInfo.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50 uppercase tracking-wider">
                        DNI
                      </p>
                      <p className="font-medium font-mono text-sm">
                        {athleteInfo.dni}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50 uppercase tracking-wider">
                        Tipo
                      </p>
                      <span className="badge badge-ghost badge-xs">
                        {athleteInfo.type_athlete ||
                          athleteInfo.type_stament ||
                          "-"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50 uppercase tracking-wider">
                        Sexo
                      </p>
                      <p className="font-medium text-sm">
                        {getGenderLabel(athleteInfo.sex)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50 uppercase tracking-wider">
                        Nacimiento
                      </p>
                      <p className="font-medium text-sm">
                        {athleteInfo.date_of_birth || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50 uppercase tracking-wider flex items-center gap-1">
                        <Phone size={10} /> Teléfono
                      </p>
                      <p className="font-medium text-sm">
                        {athleteInfo.phone || "S/N"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-base-200/50 rounded-lg p-2.5 text-center">
                      <p className="text-base font-bold text-primary">
                        {athleteInfo.height || "-"}
                      </p>
                      <p className="text-[10px] text-base-content/60">
                        Altura (cm)
                      </p>
                    </div>
                    <div className="bg-base-200/50 rounded-lg p-2.5 text-center">
                      <p className="text-base font-bold text-primary">
                        {athleteInfo.weight || "-"}
                      </p>
                      <p className="text-[10px] text-base-content/60">
                        Peso (kg)
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                // Layout horizontal cuando NO hay representante
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">
                      Nombre completo
                    </p>
                    <p className="font-medium">{athleteInfo.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">
                      DNI
                    </p>
                    <p className="font-medium font-mono">{athleteInfo.dni}</p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">
                      Tipo
                    </p>
                    <span className="badge badge-ghost badge-sm">
                      {athleteInfo.type_athlete ||
                        athleteInfo.type_stament ||
                        "-"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">
                      Sexo
                    </p>
                    <p className="font-medium">
                      {getGenderLabel(athleteInfo.sex)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">
                      Fecha de nacimiento
                    </p>
                    <p className="font-medium">
                      {athleteInfo.date_of_birth || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Phone size={10} /> Teléfono
                    </p>
                    <p className="font-medium">{athleteInfo.phone || "S/N"}</p>
                  </div>
                  <div className="bg-base-200/50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-primary">
                      {athleteInfo.height || "-"}
                    </p>
                    <p className="text-xs text-base-content/60">Altura (cm)</p>
                  </div>
                  <div className="bg-base-200/50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-primary">
                      {athleteInfo.weight || "-"}
                    </p>
                    <p className="text-xs text-base-content/60">Peso (kg)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Representative Info (only for minors) */}
          {athleteInfo.representative_id && (
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body p-5">
                <h2 className="card-title text-base flex items-center justify-between mb-4 pb-3 border-b border-base-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Users size={16} className="text-secondary" />
                    </div>
                    Representante Legal
                  </div>
                  <button
                    onClick={() =>
                      navigate(
                        ROUTES.REPRESENTATIVE_EDIT.replace(
                          ":id",
                          athleteInfo.representative_id
                        )
                      )
                    }
                    className="btn btn-ghost btn-xs gap-1"
                    title="Editar representante"
                  >
                    <Pencil size={14} />
                    Editar
                  </button>
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="col-span-2">
                    <p className="text-xs text-base-content/50 uppercase tracking-wider">
                      Nombre completo
                    </p>
                    <p className="font-medium text-sm">
                      {athleteInfo.representative_name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider">
                      DNI
                    </p>
                    <p className="font-medium font-mono text-sm">
                      {athleteInfo.representative_dni || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider">
                      Parentesco
                    </p>
                    <span className="badge badge-secondary badge-sm">
                      {getRelationshipLabel(
                        athleteInfo.representative_relationship
                      )}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider flex items-center gap-1">
                      <Phone size={10} /> Teléfono
                    </p>
                    <p className="font-medium text-sm">
                      {athleteInfo.representative_phone || "S/N"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider flex items-center gap-1">
                      <Mail size={10} /> Correo
                    </p>
                    <p
                      className="font-medium text-sm truncate"
                      title={athleteInfo.representative_email}
                    >
                      {athleteInfo.representative_email || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Individual Stats */}
        {stats && (
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <h2 className="card-title text-lg flex items-center gap-2 mb-4">
                <Activity size={20} className="text-info" />
                Estadísticas Individuales
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Physical Stats */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-base-content/80 flex items-center gap-2">
                      <Zap size={16} className="text-warning" />
                      Rendimiento Físico
                    </h3>
                    <button
                      className="btn btn-ghost btn-xs gap-1"
                      onClick={() => setShowHelpModal(true)}
                    >
                      <HelpCircle size={14} />
                      ¿Cómo se calculan?
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Speed */}
                    <div className="bg-base-200/50 rounded-lg p-3 text-center">
                      <Zap size={20} className="mx-auto mb-1 text-yellow-500" />
                      <p className="text-xl font-bold">
                        {formatStatValue(stats.speed)}
                      </p>
                      <p className="text-xs text-base-content/60 mb-1">
                        Velocidad
                      </p>
                      <span
                        className={`badge ${
                          getPerformanceLevel(stats.speed).badgeClass
                        } badge-sm`}
                      >
                        {getPerformanceLevel(stats.speed).level}
                      </span>
                    </div>
                    {/* Stamina */}
                    <div className="bg-base-200/50 rounded-lg p-3 text-center">
                      <Heart size={20} className="mx-auto mb-1 text-red-500" />
                      <p className="text-xl font-bold">
                        {formatStatValue(stats.stamina)}
                      </p>
                      <p className="text-xs text-base-content/60 mb-1">
                        Resistencia
                      </p>
                      <span
                        className={`badge ${
                          getPerformanceLevel(stats.stamina).badgeClass
                        } badge-sm`}
                      >
                        {getPerformanceLevel(stats.stamina).level}
                      </span>
                    </div>
                    {/* Strength */}
                    <div className="bg-base-200/50 rounded-lg p-3 text-center">
                      <Dumbbell
                        size={20}
                        className="mx-auto mb-1 text-blue-500"
                      />
                      <p className="text-xl font-bold">
                        {formatStatValue(stats.strength)}
                      </p>
                      <p className="text-xs text-base-content/60 mb-1">
                        Fuerza
                      </p>
                      <span
                        className={`badge ${
                          getPerformanceLevel(stats.strength).badgeClass
                        } badge-sm`}
                      >
                        {getPerformanceLevel(stats.strength).level}
                      </span>
                    </div>
                    {/* Agility */}
                    <div className="bg-base-200/50 rounded-lg p-3 text-center">
                      <Target
                        size={20}
                        className="mx-auto mb-1 text-green-500"
                      />
                      <p className="text-xl font-bold">
                        {formatStatValue(stats.agility)}
                      </p>
                      <p className="text-xs text-base-content/60 mb-1">
                        Agilidad
                      </p>
                      <span
                        className={`badge ${
                          getPerformanceLevel(stats.agility).badgeClass
                        } badge-sm`}
                      >
                        {getPerformanceLevel(stats.agility).level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Game Stats */}
                <div>
                  <h3 className="font-semibold text-base-content/80 mb-3 flex items-center gap-2">
                    <Trophy size={16} className="text-amber-500" />
                    Rendimiento Deportivo
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-base-200">
                      <span className="text-base-content/70">
                        Partidos jugados
                      </span>
                      <span className="font-bold">{stats.matches_played}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-base-200">
                      <span className="text-base-content/70">Goles</span>
                      <span className="font-bold text-success">
                        {stats.goals}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-base-200">
                      <span className="text-base-content/70">Asistencias</span>
                      <span className="font-bold text-info">
                        {stats.assists}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-base-200">
                      <span className="text-base-content/70">
                        Tarjetas amarillas
                      </span>
                      <span className="font-bold text-warning">
                        {stats.yellow_cards}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-base-content/70">
                        Tarjetas rojas
                      </span>
                      <span className="font-bold text-error">
                        {stats.red_cards}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Attendance */}
        {stats && (
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <h2 className="card-title text-lg flex items-center gap-2 mb-4">
                <Calendar size={20} className="text-success" />
                Asistencia
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-base-200/50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {stats.attendance_total}
                  </p>
                  <p className="text-sm text-base-content/60">
                    Total registros
                  </p>
                </div>
                <div className="bg-success/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-success">
                    {stats.attendance_present}
                  </p>
                  <p className="text-sm text-base-content/60">Presentes</p>
                </div>
                <div className="bg-error/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-error">
                    {stats.attendance_absent}
                  </p>
                  <p className="text-sm text-base-content/60">Ausentes</p>
                </div>
                <div className="bg-info/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-info">
                    {stats.attendance_rate}%
                  </p>
                  <p className="text-sm text-base-content/60">
                    Tasa de asistencia
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Tests */}
        {stats && (
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <h2 className="card-title text-lg flex items-center gap-2 mb-4">
                <ClipboardList size={20} className="text-secondary" />
                Tests y Evaluaciones
              </h2>

              <div className="mb-4">
                <div className="bg-secondary/10 rounded-lg p-4 inline-block">
                  <p className="text-3xl font-bold text-secondary">
                    {stats.tests_completed}
                  </p>
                  <p className="text-sm text-base-content/60">
                    Tests completados
                  </p>
                </div>
              </div>

              {stats.tests_by_type?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr className="text-base-content/60">
                        <th>Tipo de Test</th>
                        <th className="text-right">Cantidad</th>
                        <th className="text-right">Promedio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.tests_by_type.map((test, index) => (
                        <tr key={index} className="hover:bg-base-200/50">
                          <td className="font-medium">
                            {getTestLabel(test.test_type)}
                          </td>
                          <td className="text-right font-semibold text-primary">
                            {test.count}
                          </td>
                          <td className="text-right">
                            {test.avg_score !== null ? test.avg_score : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-base-content/50 text-center py-4">
                  No hay tests registrados
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Help Modal */}
      <StatsHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </>
  );
}

export default AthleteDetailPage;
