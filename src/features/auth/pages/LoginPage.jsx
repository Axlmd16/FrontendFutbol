import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "@/app/config/constants";
import PublicNavbar from "@/shared/components/PublicNavbar";

const LoginPage = () => {
  // HOOKS
  const navigate = useNavigate();
  const location = useLocation();

  // Hook de autenticación
  const { login, loading, error, isAuthenticated, clearError } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Obtener ruta de origen si existe
      const from = location.state?.from || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state?.from]);

  //    Limpiar errores al desmontar
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleLogin = async (credentials) => {
    await login(credentials);
  };

  return (
    <div>
      <PublicNavbar />
      <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Card principal */}
          <div className="bg-base-100 rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              {/* Logo */}
              <div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>

              {/* Título */}
              <h1 className="text-3xl font-bold text-base-content">
                Kallpa UNL
              </h1>
              <p className="mt-2 text-base-content/70">
                Sistema de Gestión Deportiva
              </p>
            </div>

            {/* Mensaje de estado  */}
            {location.state?.message && (
              <div className="mb-6 bg-success/10 border border-success/30 text-success px-4 py-3 rounded-lg">
                <p className="text-sm">{location.state.message}</p>
              </div>
            )}

            {/* Formulario de login */}
            <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
