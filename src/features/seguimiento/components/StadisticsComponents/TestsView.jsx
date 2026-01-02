/**
 * TestsView Component
 *
 * Vista de estadísticas de tests con información detallada
 * y gráficos complementarios.
 */

import React from "react";
import PropTypes from "prop-types";
import { Activity, Award, BarChart3, Trophy } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import KPICard from "./KPICard";
import { TEST_TYPE_LABELS } from "@/app/config/constants";

// Helper para obtener nombre y color en español desde constantes
const getTestNameES = (testType) =>
  TEST_TYPE_LABELS[testType]?.name || testType;
const getTestShortName = (testType) =>
  TEST_TYPE_LABELS[testType]?.shortName || testType;
const getTestColor = (testType) =>
  TEST_TYPE_LABELS[testType]?.color || "#6B7280";

function TestsView({ testPerformance }) {
  if (!testPerformance) {
    return (
      <div className="text-center py-8 text-base-content/60">
        No hay datos de tests disponibles
      </div>
    );
  }

  // Preparar datos para gráfico con nombres cortos desde constantes
  const chartData =
    testPerformance.tests_by_type?.map((item) => ({
      name: getTestShortName(item.test_type),
      tests: item.total_tests,
      fill: getTestColor(item.test_type),
    })) || [];

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          icon={Activity}
          title="Total de Tests"
          value={testPerformance.total_tests || 0}
          color="primary"
        />
        <KPICard
          icon={BarChart3}
          title="Tipos de Tests"
          value={testPerformance.tests_by_type?.length || 0}
          subtitle="Categorías"
          color="info"
        />
        <KPICard
          icon={Trophy}
          title="Mejor Atleta"
          value={testPerformance.top_performers?.[0]?.tests_completed || 0}
          subtitle={
            testPerformance.top_performers?.[0]?.athlete_name?.split(" ")[0] ||
            "-"
          }
          color="warning"
        />
        <KPICard
          icon={Award}
          title="Atletas Evaluados"
          value={testPerformance.top_performers?.length || 0}
          color="success"
        />
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Detalles por tipo de test */}
        <div className="lg:col-span-2 card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
              <Activity size={18} className="text-primary" />
              Rendimiento por Tipo de Test
            </h3>
            {testPerformance.tests_by_type?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr className="text-base-content/60">
                      <th>Tipo</th>
                      <th className="text-right">Tests</th>
                      <th className="text-right">Promedio</th>
                      <th className="text-right">Mín</th>
                      <th className="text-right">Máx</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testPerformance.tests_by_type.map((item, index) => (
                      <tr key={index} className="hover:bg-base-200/50">
                        <td>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{
                                backgroundColor: getTestColor(item.test_type),
                              }}
                            />
                            <span className="font-medium">
                              {getTestNameES(item.test_type)}
                            </span>
                          </div>
                        </td>
                        <td className="text-right font-semibold text-primary">
                          {item.total_tests}
                        </td>
                        <td className="text-right">
                          {item.avg_score !== null ? item.avg_score : "-"}
                        </td>
                        <td className="text-right text-base-content/60">
                          {item.min_score !== null ? item.min_score : "-"}
                        </td>
                        <td className="text-right text-base-content/60">
                          {item.max_score !== null ? item.max_score : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-base-content/50 text-sm text-center py-4">
                Sin tests registrados
              </p>
            )}
          </div>
        </div>

        {/* Mini gráfico */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
              <BarChart3 size={18} className="text-info" />
              Distribución
            </h3>
            {chartData.length > 0 ? (
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10 }}
                      stroke="oklch(var(--bc)/0.3)"
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      stroke="oklch(var(--bc)/0.3)"
                      width={70}
                    />
                    <Tooltip
                      formatter={(value) => [value, "Tests"]}
                      contentStyle={{
                        backgroundColor: "oklch(var(--b1))",
                        border: "1px solid oklch(var(--b3))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="tests" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-base-content/50 text-sm text-center py-8">
                Sin datos
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Top performers */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body p-4">
          <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
            <Award size={18} className="text-warning" />
            Top Deportistas por Evaluaciones
          </h3>
          {testPerformance.top_performers?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {testPerformance.top_performers.map((athlete, index) => (
                <div
                  key={athlete.athlete_id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30"
                      : index === 1
                      ? "bg-gradient-to-r from-gray-400/20 to-gray-400/5 border border-gray-400/30"
                      : index === 2
                      ? "bg-gradient-to-r from-amber-600/20 to-amber-600/5 border border-amber-600/30"
                      : "bg-base-200/50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 ${
                      index === 0
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                        : index === 1
                        ? "bg-gradient-to-br from-gray-300 to-gray-500"
                        : index === 2
                        ? "bg-gradient-to-br from-amber-500 to-amber-700"
                        : "bg-base-content/30"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base-content text-sm truncate">
                      {athlete.athlete_name}
                    </p>
                    <p className="text-xs text-base-content/60">
                      {athlete.tests_completed} tests
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-base-content/50 text-sm text-center py-4">
              No hay datos de atletas destacados
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

TestsView.propTypes = {
  testPerformance: PropTypes.shape({
    total_tests: PropTypes.number,
    tests_by_type: PropTypes.array,
    top_performers: PropTypes.array,
  }),
};

export default TestsView;
