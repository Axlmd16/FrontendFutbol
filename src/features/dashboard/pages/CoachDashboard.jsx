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

const CoachDashboard = () => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Dashboard Entrenador
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Acceso a inscripciones, evaluaciones, estadísticas y reportes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card
          title="Inscripciones"
          description="Registrar deportistas y menores."
          to={ROUTES.INSCRIPTION_DEPORTISTA}
          cta="Registrar"
        />
        <Card
          title="Evaluaciones"
          description="Crear y editar evaluaciones."
          to={ROUTES.EVALUATIONS}
          cta="Ver"
        />
        <Card
          title="Estadísticas"
          description="Consultar métricas de rendimiento."
          to={ROUTES.STATISTICS}
          cta="Abrir"
        />
        <Card
          title="Reportes"
          description="Ver y exportar reportes."
          to={ROUTES.REPORTS}
          cta="Abrir"
        />
      </div>
    </div>
  );
};

export default CoachDashboard;
