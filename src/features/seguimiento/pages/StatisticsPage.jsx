/**
 * StatisticsPage Component
 *
 * Dashboard de estadísticas del club con métricas clave,
 * asistencia y rendimiento en tests.
 */

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  BarChart3,
  Users,
  CalendarCheck,
  Activity,
  TrendingUp,
  TrendingDown,
  Filter,
  RefreshCw,
  Calendar,
  UserCheck,
  Award,
  Target,
} from "lucide-react";

// Componentes compartidos
import Button from "@/shared/components/Button";
import Loader from "@/shared/components/Loader";

// Servicios
import statisticsApi from "../services/statistics.api";

// Constantes
import {
  ESTAMENTO_FILTER_OPTIONS,
  GENDER_OPTIONS,
} from "@/app/config/constants";

/**
 * Página de estadísticas del club
 */
function StatisticsPage() {
  // Estado de datos
  const [clubOverview, setClubOverview] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [testPerformance, setTestPerformance] = useState(null);

  // Estado de carga
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    type_athlete: "",
    sex: "",
    start_date: "",
    end_date: "",
  });

  // Vista activa
  const [activeView, setActiveView] = useState("overview");

  // Presets de fecha
  const datePresets = [
    { label: "Últimos 7 días", days: 7 },
    { label: "Últimos 30 días", days: 30 },
    { label: "Últimos 90 días", days: 90 },
    { label: "Este año", days: 365 },
  ];

  // Aplicar preset de fecha
  const applyDatePreset = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    setFilters((prev) => ({
      ...prev,
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
    }));
  };

  // Cargar datos
  const fetchData = useCallback(async () => {
    try {
      const params = {
        type_athlete: filters.type_athlete || undefined,
        sex: filters.sex || undefined,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
      };

      // Use Promise.allSettled to handle individual failures
      const [overviewResult, attendanceResult, testsResult] =
        await Promise.allSettled([
          statisticsApi.getClubOverview(params),
          statisticsApi.getAttendanceStats(params),
          statisticsApi.getTestPerformance(params),
        ]);

      // Handle overview
      if (
        overviewResult.status === "fulfilled" &&
        overviewResult.value?.status === "success"
      ) {
        setClubOverview(overviewResult.value.data);
        console.log(overviewResult.value.data);
      }

      // Handle attendance
      if (
        attendanceResult.status === "fulfilled" &&
        attendanceResult.value?.status === "success"
      ) {
        setAttendanceStats(attendanceResult.value.data);
        console.log(attendanceResult.value.data);
      }

      // Handle tests
      if (
        testsResult.status === "fulfilled" &&
        testsResult.value?.status === "success"
      ) {
        setTestPerformance(testsResult.value.data);
        console.log(testsResult.value.data);
      }

      // Check for any errors and show them
      const errors = [];
      if (overviewResult.status === "rejected") {
        errors.push(`Overview: ${overviewResult.reason?.message}`);
      }
      if (attendanceResult.status === "rejected") {
        errors.push(`Attendance: ${attendanceResult.reason?.message}`);
      }
      if (testsResult.status === "rejected") {
        errors.push(`Tests: ${testsResult.reason?.message}`);
      }

      if (errors.length > 0) {
        console.error("Errores en estadísticas:", errors);
        // Only show toast if ALL failed
        if (errors.length === 3) {
          toast.error("Error al cargar estadísticas", {
            description: errors[0],
          });
        }
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
      toast.error("Error al cargar estadísticas", {
        description: error.message || "Intente nuevamente",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refrescar datos
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      type_athlete: "",
      sex: "",
      start_date: "",
      end_date: "",
    });
  };

  // Renderizar KPI Card
  const KPICard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    color = "primary",
  }) => (
    <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow">
      <div className="card-body p-5">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl bg-${color}/10`}>
            <Icon size={24} className={`text-${color}`} />
          </div>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                trend >= 0 ? "text-success" : "text-error"
              }`}
            >
              {trend >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold text-base-content">{value}</p>
          <p className="text-sm font-medium text-base-content mt-1">{title}</p>
          {subtitle && (
            <p className="text-xs text-base-content/60 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  // Renderizar barra de progreso
  const ProgressBar = ({ label, value, max, color = "primary" }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-base-content/80">{label}</span>
          <span className="font-medium text-base-content">
            {value} ({percentage.toFixed(1)}%)
          </span>
        </div>
        <div className="w-full bg-base-200 rounded-full h-2.5">
          <div
            className={`bg-${color} h-2.5 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="bg-primary/10 p-1.5 rounded-lg">
                <BarChart3 size={16} />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Módulo de Seguimiento
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Estadísticas del Club
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Visualiza métricas clave, asistencia y rendimiento
            </p>
          </div>

          {/* Botón Refrescar */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Actualizar
          </Button>
        </div>

        {/* Filtros */}
        <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={16} className="text-primary" />
              <span className="font-medium text-base-content text-sm">
                Filtros
              </span>
            </div>

            {/* Presets de fecha */}
            <div className="flex flex-wrap gap-2 mb-4">
              {datePresets.map((preset) => (
                <button
                  key={preset.days}
                  onClick={() => applyDatePreset(preset.days)}
                  className="btn btn-sm btn-ghost border border-base-300 hover:bg-primary/10 hover:border-primary"
                >
                  {preset.label}
                </button>
              ))}
              <button
                onClick={handleClearFilters}
                className="btn btn-sm btn-ghost text-error hover:bg-error/10"
              >
                Limpiar
              </button>
            </div>

            {/* Filtros principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Tipo de atleta */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs">Tipo de Atleta</span>
                </label>
                <select
                  value={filters.type_athlete}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      type_athlete: e.target.value,
                    }))
                  }
                  className="select select-bordered select-sm w-full bg-base-100"
                >
                  {ESTAMENTO_FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sexo */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs">Sexo</span>
                </label>
                <select
                  value={filters.sex}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sex: e.target.value }))
                  }
                  className="select select-bordered select-sm w-full bg-base-100"
                >
                  <option value="">Todos</option>
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha inicio */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs">Desde</span>
                </label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      start_date: e.target.value,
                    }))
                  }
                  className="input input-bordered input-sm w-full bg-base-100"
                />
              </div>

              {/* Fecha fin */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs">Hasta</span>
                </label>
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      end_date: e.target.value,
                    }))
                  }
                  className="input input-bordered input-sm w-full bg-base-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Toggle de vistas */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "overview", label: "General", icon: BarChart3 },
            { id: "attendance", label: "Asistencia", icon: CalendarCheck },
            { id: "tests", label: "Tests", icon: Activity },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`btn btn-sm gap-2 ${
                activeView === view.id
                  ? "btn-primary"
                  : "btn-ghost border border-base-300"
              }`}
            >
              <view.icon size={16} />
              {view.label}
            </button>
          ))}
        </div>

        {/* Vista General */}
        {activeView === "overview" && clubOverview && (
          <>
            {/* KPIs principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KPICard
                icon={Users}
                title="Total Deportistas"
                value={clubOverview.total_athletes || 0}
                subtitle={`${clubOverview.active_athletes || 0} activos`}
                color="primary"
              />
              <KPICard
                icon={UserCheck}
                title="Tasa de Asistencia"
                value={`${attendanceStats?.overall_attendance_rate || 0}%`}
                subtitle="Promedio general"
                color="success"
              />
              <KPICard
                icon={Target}
                title="Evaluaciones"
                value={clubOverview.total_evaluations || 0}
                subtitle="Total realizadas"
                color="info"
              />
              <KPICard
                icon={Award}
                title="Tests Completados"
                value={clubOverview.total_tests || 0}
                subtitle="En todas las categorías"
                color="warning"
              />
            </div>

            {/* Distribuciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Por tipo de atleta */}
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <h3 className="card-title text-lg">
                    <Users size={20} className="text-primary" />
                    Distribución por Tipo
                  </h3>
                  <div className="mt-4">
                    {clubOverview.athletes_by_type?.length > 0 ? (
                      clubOverview.athletes_by_type.map((item, index) => (
                        <ProgressBar
                          key={index}
                          label={item.type_athlete}
                          value={item.count}
                          max={clubOverview.active_athletes}
                          color={
                            [
                              "primary",
                              "secondary",
                              "accent",
                              "info",
                              "success",
                            ][index % 5]
                          }
                        />
                      ))
                    ) : (
                      <p className="text-base-content/60 text-center py-4">
                        No hay datos disponibles
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Por género */}
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <h3 className="card-title text-lg">
                    <Users size={20} className="text-secondary" />
                    Distribución por Género
                  </h3>
                  <div className="mt-4">
                    {clubOverview.athletes_by_gender?.length > 0 ? (
                      clubOverview.athletes_by_gender.map((item, index) => (
                        <ProgressBar
                          key={index}
                          label={
                            item.sex === "MALE"
                              ? "Masculino"
                              : item.sex === "FEMALE"
                              ? "Femenino"
                              : item.sex
                          }
                          value={item.count}
                          max={clubOverview.active_athletes}
                          color={index === 0 ? "info" : "accent"}
                        />
                      ))
                    ) : (
                      <p className="text-base-content/60 text-center py-4">
                        No hay datos disponibles
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Vista Asistencia */}
        {activeView === "attendance" && attendanceStats && (
          <>
            {/* KPIs de asistencia */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <KPICard
                icon={Calendar}
                title="Total Registros"
                value={attendanceStats.total_records || 0}
                color="primary"
              />
              <KPICard
                icon={UserCheck}
                title="Presentes"
                value={attendanceStats.total_present || 0}
                subtitle={`${
                  attendanceStats.overall_attendance_rate || 0
                }% de asistencia`}
                color="success"
              />
              <KPICard
                icon={Users}
                title="Ausentes"
                value={attendanceStats.total_absent || 0}
                color="error"
              />
            </div>

            {/* Asistencia por tipo */}
            <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
              <div className="card-body">
                <h3 className="card-title text-lg">
                  <BarChart3 size={20} className="text-primary" />
                  Asistencia por Tipo de Atleta
                </h3>
                <div className="mt-4">
                  {attendanceStats.attendance_by_type?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="table table-zebra">
                        <thead>
                          <tr>
                            <th>Tipo</th>
                            <th className="text-right">Total</th>
                            <th className="text-right">Presentes</th>
                            <th className="text-right">Tasa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceStats.attendance_by_type.map(
                            (item, index) => (
                              <tr key={index}>
                                <td className="font-medium">
                                  {item.type_athlete}
                                </td>
                                <td className="text-right">{item.total}</td>
                                <td className="text-right">{item.present}</td>
                                <td className="text-right">
                                  <span
                                    className={`badge ${
                                      item.attendance_rate >= 80
                                        ? "badge-success"
                                        : item.attendance_rate >= 60
                                        ? "badge-warning"
                                        : "badge-error"
                                    }`}
                                  >
                                    {item.attendance_rate}%
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-base-content/60 text-center py-8">
                      No hay datos de asistencia disponibles
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tendencia de asistencia */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-lg">
                  <TrendingUp size={20} className="text-success" />
                  Historial de Asistencia (Últimos 30 días)
                </h3>
                <div className="mt-4">
                  {attendanceStats.attendance_by_period?.length > 0 ? (
                    <div className="flex items-end gap-1 h-40 overflow-x-auto pb-2">
                      {attendanceStats.attendance_by_period
                        .slice()
                        .reverse()
                        .map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center min-w-[30px]"
                          >
                            <div
                              className={`w-6 rounded-t transition-all ${
                                item.attendance_rate >= 80
                                  ? "bg-success"
                                  : item.attendance_rate >= 60
                                  ? "bg-warning"
                                  : "bg-error"
                              }`}
                              style={{
                                height: `${Math.max(item.attendance_rate, 5)}%`,
                              }}
                              title={`${item.date}: ${item.attendance_rate}%`}
                            />
                            <span className="text-[8px] text-base-content/50 mt-1 rotate-45">
                              {item.date.slice(-5)}
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-base-content/60 text-center py-8">
                      No hay datos de tendencia disponibles
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Vista Tests */}
        {activeView === "tests" && testPerformance && (
          <>
            {/* Total tests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <KPICard
                icon={Activity}
                title="Total Tests Realizados"
                value={testPerformance.total_tests || 0}
                color="primary"
              />
              <KPICard
                icon={Award}
                title="Tipos de Tests"
                value={testPerformance.tests_by_type?.length || 0}
                subtitle="Categorías disponibles"
                color="info"
              />
            </div>

            {/* Tests por tipo */}
            <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
              <div className="card-body">
                <h3 className="card-title text-lg">
                  <BarChart3 size={20} className="text-primary" />
                  Rendimiento por Tipo de Test
                </h3>
                <div className="mt-4">
                  {testPerformance.tests_by_type?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {testPerformance.tests_by_type.map((item, index) => (
                        <div
                          key={index}
                          className="bg-base-200/50 rounded-xl p-4 border border-base-300"
                        >
                          <h4 className="font-semibold text-base-content mb-2">
                            {item.test_type}
                          </h4>
                          <p className="text-3xl font-bold text-primary">
                            {item.total_tests}
                          </p>
                          <p className="text-xs text-base-content/60">
                            tests realizados
                          </p>
                          {item.avg_score && (
                            <div className="mt-2 pt-2 border-t border-base-300">
                              <p className="text-sm">
                                <span className="text-base-content/60">
                                  Promedio:
                                </span>{" "}
                                <span className="font-medium">
                                  {item.avg_score}
                                </span>
                              </p>
                              <p className="text-xs text-base-content/50">
                                Min: {item.min_score} | Max: {item.max_score}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base-content/60 text-center py-8">
                      No hay tests registrados
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Top performers */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-lg">
                  <Award size={20} className="text-warning" />
                  Top Deportistas
                </h3>
                <div className="mt-4">
                  {testPerformance.top_performers?.length > 0 ? (
                    <div className="space-y-3">
                      {testPerformance.top_performers.map((athlete, index) => (
                        <div
                          key={athlete.athlete_id}
                          className="flex items-center gap-4 p-3 bg-base-200/50 rounded-xl"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0
                                ? "bg-warning"
                                : index === 1
                                ? "bg-base-content/40"
                                : index === 2
                                ? "bg-accent"
                                : "bg-base-content/20"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-base-content">
                              {athlete.athlete_name}
                            </p>
                            <p className="text-xs text-base-content/60">
                              {athlete.athlete_type || "Sin tipo"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">
                              {athlete.tests_completed}
                            </p>
                            <p className="text-xs text-base-content/60">
                              evaluaciones
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base-content/60 text-center py-8">
                      No hay datos de atletas destacados
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StatisticsPage;
