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

const AdminDashboard = () => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Dashboard Administrador
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Acceso completo a usuarios, inscripciones y seguimiento.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card
          title="Usuarios"
          description="Crear, editar y administrar usuarios del sistema."
          to={ROUTES.USERS}
          cta="Gestionar"
        />
        <Card
          title="Inscripciones"
          description="Registrar deportistas y menores (escuela/club)."
          to={ROUTES.INSCRIPTION_DEPORTISTA}
          cta="Registrar"
        />
        <Card
          title="Evaluaciones"
          description="Crear y administrar evaluaciones deportivas."
          to={ROUTES.EVALUATIONS}
          cta="Ver"
        />
        <Card
          title="Estadísticas"
          description="Consultar métricas y rendimiento."
          to={ROUTES.STATISTICS}
          cta="Abrir"
        />
        <Card
          title="Reportes"
          description="Exportar reportes y ver resúmenes."
          to={ROUTES.REPORTS}
          cta="Abrir"
        />
        <Card
          title="Configuración"
          description="Ajustes generales del sistema."
          to={ROUTES.SETTINGS}
          cta="Abrir"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
