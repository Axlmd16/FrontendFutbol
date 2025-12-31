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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={handleCancel}
          className="flex items-center gap-1 text-base-content/60 hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Volver a la lista</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <UserCog size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Editar Deportista
            </h1>
            <p className="text-base-content/60 text-sm">
              Modifica los datos de{" "}
              <strong className="text-base-content">
                {athlete?.full_name}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
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
  );
};

export default EditAthletePage;
