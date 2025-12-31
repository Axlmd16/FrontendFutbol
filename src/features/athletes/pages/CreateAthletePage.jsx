import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DeportistaForm from "@/features/inscription/components/DeportistaForm";
import athletesApi from "@/features/athletes/services/athletes.api";
import { ROUTES, MESSAGES } from "@/app/config/constants";
import { ArrowLeft, UserPlus } from "lucide-react";

const CreateAthletePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (athleteData) => {
    setLoading(true);
    setError(null);

    try {
      await athletesApi.create(athleteData);
      toast.success(MESSAGES.SUCCESS.ATHLETE_CREATED, {
        description: MESSAGES.SUCCESS.ATHLETE_CREATED_DESC,
      });
      navigate(ROUTES.INSCRIPTION);
    } catch (err) {
      const errorMessage = err.message || MESSAGES.ERROR.GENERIC;
      setError(errorMessage);
      toast.error(MESSAGES.ERROR.ATHLETE_CREATE, {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.INSCRIPTION);
  };

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
            <UserPlus size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Nuevo Deportista
            </h1>
            <p className="text-base-content/60 text-sm">
              Completa el formulario para agregar un nuevo deportista.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <DeportistaForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            error={error}
            isMenor={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateAthletePage;
