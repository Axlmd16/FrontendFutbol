import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "../components/UserForm";
import Loader from "@/shared/components/Loader";
import usersApi from "../services/users.api";
import { ROUTES, MESSAGES } from "@/app/config/constants";

const EditUserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Obtener ID de la URL
  const { id } = useParams();
  const navigate = useNavigate();

  /**
   * Obtiene los datos del usuario
   */
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await usersApi.getById(id);
        setUser(response?.data ?? null);
        console.log("User data fetched:", response);
      } catch (err) {
        setError(err.message || "No se pudo cargar el usuario");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  // ==============================================
  // MANEJADORES
  // ==============================================

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (userData) => {
    setSaving(true);
    setError(null);

    try {
      await usersApi.update(id, userData);

      // TODO: Mostrar toast de éxito
      console.log(MESSAGES.SUCCESS.UPDATED);

      // Navegar a la lista de usuarios
      navigate(ROUTES.USERS);
    } catch (err) {
      setError(err.message || MESSAGES.ERROR.GENERIC);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Maneja la cancelación
   */
  const handleCancel = () => {
    navigate(ROUTES.USERS);
  };

  // ==============================================
  // RENDER - CARGANDO
  // ==============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // ==============================================
  // RENDER - ERROR DE CARGA
  // ==============================================

  if (!user && !loading) {
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
              Usuario no encontrado
            </h2>
            <p className="mt-2 text-gray-500">
              {error || "El usuario que buscas no existe o fue eliminado."}
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

  // ==============================================
  // RENDER - FORMULARIO
  // ==============================================

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
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

          <h1 className="text-2xl font-bold text-gray-900">Editar usuario</h1>
          <p className="mt-1 text-sm text-gray-500">
            Modifica los datos del usuario <strong>{user?.full_name}</strong>
          </p>
        </div>

        {/* Card con formulario */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <UserForm
            initialData={user}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={saving}
            error={error}
            isEdit={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;
