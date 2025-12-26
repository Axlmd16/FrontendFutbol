import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import UserForm from "../components/UserForm";
import usersApi from "../services/users.api";
import { ROUTES, MESSAGES } from "@/app/config/constants";

const CreateUserPage = () => {
  // ==============================================
  // ESTADO

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // ==============================================
  // MANEJADORES

  // Maneja el envío del formulario
  const handleSubmit = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      await usersApi.create(userData);

      // TODO: Mostrar toast de éxito
      console.log(MESSAGES.SUCCESS.CREATED);

      // Navegar a la lista de usuarios
      navigate(ROUTES.USERS);
    } catch (err) {
      setError(err.message || MESSAGES.ERROR.GENERIC);
    } finally {
      setLoading(false);
    }
  };

  // Maneja la cancelación
  const handleCancel = () => {
    navigate(ROUTES.USERS);
  };

  // ==============================================
  // RENDER

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

          <h1 className="text-2xl font-bold text-gray-900">Crear usuario</h1>
          <p className="mt-1 text-sm text-gray-500">
            Completa el formulario para agregar un nuevo usuario al sistema.
          </p>
        </div>

        {/* Card con formulario */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* <UserForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            error={error}
            isEdit={false}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
