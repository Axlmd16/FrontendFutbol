import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DeportistaForm from "@/features/inscription/components/DeportistaForm";
import athletesApi from "@/features/athletes/services/athletes.api";
import { ROUTES, MESSAGES } from "@/app/config/constants";

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
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className=" max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver
          </button>

          <h1 className="text-2xl font-bold text-gray-900">Crear deportista</h1>
          <p className="mt-1 text-sm text-gray-500">
            Completa el formulario para agregar un nuevo deportista.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
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
