import { Link } from "react-router-dom";
import { ROUTES } from "@/app/config/constants";

const Card = ({ title, description, to, cta }) => (
  <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
    <div className="text-base font-semibold text-base-content">{title}</div>
    <div className="mt-1 text-sm text-base-content/70">{description}</div>
    {to && (
      <div className="mt-4">
        <Link
          to={to}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-content hover:bg-primary/90"
        >
          {cta || "Abrir"}
        </Link>
      </div>
    )}
  </div>
);

const CoachDashboard = () => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-base-content">
          Dashboard Entrenador
        </h1>
        <p className="mt-1 text-sm text-base-content/70">
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
