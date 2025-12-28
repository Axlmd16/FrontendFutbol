/**
 * ==============================================
 * Registro Club (Público) - Kallpa UNL
 * ==============================================
 *
 * Registro normal (datos personales del deportista).
 * Después de registrar, redirige a login.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "@/shared/components/PublicNavbar";
import DeportistaForm from "@/features/inscription/components/DeportistaForm";
// import inscriptionApi from "@/features/inscription/services/inscription.api";
import { MESSAGES, ROUTES } from "@/app/config/constants";

const RegisterClubPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (athletePayload) => {
    setLoading(true);
    setError(null);

    try {
      await inscriptionApi.registerDeportista(athletePayload);

      navigate(ROUTES.LOGIN, {
        replace: true,
        state: { message: "Registro completado. Ahora puedes iniciar sesión." },
      });
    } catch (err) {
      setError(err?.message || MESSAGES.ERROR.GENERIC);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(ROUTES.REGISTER)}
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

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Registro para Club
          </h1>
          <p className="text-sm text-gray-600">
            Completa los datos personales del deportista.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <DeportistaForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(ROUTES.REGISTER)}
            loading={loading}
            error={error}
            isMenor={false}
          />
        </div>
      </main>
    </div>
  );
};

export default RegisterClubPage;
