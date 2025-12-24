/**
 * ==============================================
 * Página de Reportes - Kallpa UNL
 * ==============================================
 * 
 * Base para reportes deportivos.
 */

import Button from '@/shared/components/Button';

const ReportsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
            <p className="text-sm text-gray-500">Exportación y análisis</p>
          </div>
          <Button variant="secondary" disabled>
            Exportar (pendiente)
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-600">
          Estructura lista. Aquí se integrarán filtros por periodo, generación de PDF y resúmenes.
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
