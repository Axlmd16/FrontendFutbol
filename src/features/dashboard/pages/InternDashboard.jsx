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

const InternDashboard = () => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-base-content">
          Dashboard Pasante
        </h1>
        <p className="mt-1 text-sm text-base-content/70">
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
