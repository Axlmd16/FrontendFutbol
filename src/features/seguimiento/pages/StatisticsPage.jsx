/**
 * ==============================================
 * Página de Estadísticas - Kallpa UNL
 * ==============================================
 * 
 * Base para visualizar KPIs y gráficos.
 */

import { useEffect, useState } from 'react';
import seguimientoApi from '../services/seguimiento.api';
import Loader from '@/shared/components/Loader';
import StatsCard from '../components/StatsCard';
import AttendanceChart from '../components/Charts/AttendanceChart';
import PerformanceChart from '../components/Charts/PerformanceChart';

const StatisticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await seguimientoApi.getStatistics();
        setStats(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Estadísticas</h1>
          <p className="text-sm text-gray-500">Indicadores clave y evolución</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatsCard title="Evaluaciones" value={stats?.evaluationsCount ?? '-'} />
              <StatsCard title="Deportistas" value={stats?.athletesCount ?? '-'} />
              <StatsCard title="Asistencia" value={stats?.attendanceRate ?? '-'} subtitle="%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AttendanceChart />
              <PerformanceChart />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
