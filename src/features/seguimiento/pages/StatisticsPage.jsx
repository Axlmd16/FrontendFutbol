/**
 * StatisticsPage Component
 *
 * Dashboard de estadísticas del club con métricas clave,
 * asistencia y rendimiento en tests.
 */

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { BarChart3, RefreshCw } from "lucide-react";

// Componentes compartidos
import Button from "@/shared/components/Button";
import Loader from "@/shared/components/Loader";

// Componentes de estadísticas
import {
  StatisticsFilters,
  StatisticsViewToggle,
  OverviewView,
  AttendanceView,
  TestsView,
} from "../components/StadisticsComponents";

// Servicios
import statisticsApi from "../services/statistics.api";

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
      }

      // Handle attendance
      if (
        attendanceResult.status === "fulfilled" &&
        attendanceResult.value?.status === "success"
      ) {
        setAttendanceStats(attendanceResult.value.data);
      }

      // Handle tests
      if (
        testsResult.status === "fulfilled" &&
        testsResult.value?.status === "success"
      ) {
        setTestPerformance(testsResult.value.data);
      }

      // Check for any errors
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
        <StatisticsFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClear={handleClearFilters}
        />

        {/* Toggle de vistas */}
        <StatisticsViewToggle
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Vista General */}
        {activeView === "overview" && (
          <OverviewView
            clubOverview={clubOverview}
            attendanceStats={attendanceStats}
          />
        )}

        {/* Vista Asistencia */}
        {activeView === "attendance" && (
          <AttendanceView attendanceStats={attendanceStats} />
        )}

        {/* Vista Tests */}
        {activeView === "tests" && (
          <TestsView testPerformance={testPerformance} />
        )}
      </div>
    </div>
  );
}

export default StatisticsPage;
