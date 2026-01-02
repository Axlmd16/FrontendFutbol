import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import DeportistaForm from "@/features/inscription/components/DeportistaForm";
import Loader from "@/shared/components/Loader";
import athletesApi from "@/features/athletes/services/athletes.api";
import { ROUTES, MESSAGES } from "@/app/config/constants";
import { ArrowLeft, UserCog, AlertCircle } from "lucide-react";

const EditAthletePage = () => {
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAthlete = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await athletesApi.getById(id);
        setAthlete(response?.data ?? null);
      } catch (err) {
        setError(err.message || MESSAGES.ERROR.ATHLETE_LOAD);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAthlete();
    }
  }, [id]);

  const handleSubmit = async (athleteData) => {
    setSaving(true);
    setError(null);

    try {
      await athletesApi.update(id, athleteData);
      toast.success(MESSAGES.SUCCESS.ATHLETE_UPDATED, {
        description: MESSAGES.SUCCESS.ATHLETE_UPDATED_DESC,
      });
      navigate(ROUTES.INSCRIPTION);
    } catch (err) {
      const errorMessage = err.message || MESSAGES.ERROR.GENERIC;
      setError(errorMessage);
      toast.error(MESSAGES.ERROR.ATHLETE_UPDATE, {
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.INSCRIPTION);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  // Not found state
  if (!athlete && !loading) {
    return (
      <div className="space-y-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-1 text-base-content/60 hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Volver a la lista</span>
        </button>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body items-center text-center py-16">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
              <AlertCircle size={32} className="text-error" />
            </div>
            <h2 className="text-xl font-bold text-base-content">
              Deportista no encontrado
            </h2>
            <p className="text-base-content/60 max-w-sm">
              {error || "El deportista que buscas no existe o fue eliminado."}
            </p>
            <button
              onClick={handleCancel}
              className="btn btn-primary btn-sm mt-4"
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        <button
          onClick={handleCancel}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 mb-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Volver a la lista
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <span className="bg-primary/10 p-1 rounded-md">
              <UserCog size={14} />
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Editar Deportista
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {athlete?.full_name}
          </h1>
          <p className="text-slate-500 text-sm">
            Modifica los datos del deportista.
          </p>
        </div>

        {/* Form Card */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <DeportistaForm
              initialData={athlete}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={saving}
              error={error}
              isMenor={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAthletePage;
