import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/config/constants';

const Card = ({ title, description, to, cta }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5">
    <div className="text-base font-semibold text-gray-900">{title}</div>
    <div className="mt-1 text-sm text-gray-600">{description}</div>
    {to && (
      <div className="mt-4">
        <Link
          to={to}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {cta || 'Abrir'}
        </Link>
      </div>
    )}
  </div>
);

const InternDashboard = () => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard Pasante</h1>
        <p className="mt-1 text-sm text-gray-600">
          Acceso de consulta a estadísticas y reportes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card
          title="Estadísticas"
          description="Consultar estadísticas y métricas disponibles."
          to={ROUTES.STATISTICS}
          cta="Abrir"
        />
        <Card
          title="Reportes"
          description="Ver reportes disponibles para exportación."
          to={ROUTES.REPORTS}
          cta="Abrir"
        />
      </div>
    </div>
  );
};

export default InternDashboard;
