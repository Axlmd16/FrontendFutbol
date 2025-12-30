import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import DeportistaForm from "@/features/inscription/components/DeportistaForm";
import Loader from "@/shared/components/Loader";
import athletesApi from "@/features/athletes/services/athletes.api";
import { ROUTES, MESSAGES } from "@/app/config/constants";
import { ChevronLeft } from "lucide-react";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!athlete && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Deportista no encontrado
            </h2>
            <p className="mt-2 text-gray-500">
              {error || "El deportista que buscas no existe o fue eliminado."}
            </p>
            <button
              onClick={handleCancel}
              className="mt-6 text-blue-600 hover:text-blue-500 font-medium"
            >
              ← Volver a la lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft size={25} className="mr-1" />
            Volver
          </button>

          <h1 className="text-2xl font-bold text-gray-900">Editar deportista</h1>
          <p className="mt-1 text-sm text-gray-500">
            Modifica los datos del deportista <strong>{athlete?.full_name}</strong>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
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
