/**
 * ==============================================
 * Registro Club (Público) - Kallpa UNL
 * ==============================================
 *
 * Registro normal (datos personales del deportista).
 * Muestra mensaje de éxito tras el registro.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PublicNavbar from "@/shared/components/PublicNavbar";
import DeportistaForm from "@/features/inscription/components/DeportistaForm";
import inscriptionApi from "@/features/inscription/services/inscription.api";
import Button from "@/shared/components/Button";
import { MESSAGES, ROUTES } from "@/app/config/constants";
import { CheckCircle, ArrowLeft, Home } from "lucide-react";

const RegisterClubPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [athleteName, setAthleteName] = useState("");

  const handleSubmit = async (athletePayload) => {
    setLoading(true);
    setError(null);

    try {
      console.log("athletePayload", athletePayload);
      await inscriptionApi.registerDeportista(athletePayload);

      // Guardar nombre para mostrar en mensaje de éxito
      setAthleteName(
        `${athletePayload.first_name} ${athletePayload.last_name}`
      );

      // Mostrar toast de éxito
      toast.success("¡Registro exitoso!", {
        description: "Tu información ha sido registrada correctamente.",
      });

      // Mostrar pantalla de éxito
      setRegistrationSuccess(true);
    } catch (err) {
      toast.error("Error en el registro", {
        description: err?.message || MESSAGES.ERROR.GENERIC,
      });
      setError(err?.message || MESSAGES.ERROR.GENERIC);
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de éxito después del registro
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-base-200">
        <PublicNavbar />

        <main className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-2xl mx-auto">
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body items-center text-center p-10">
                {/* Icono de éxito */}
                <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle className="w-14 h-14 text-success" />
                </div>

                {/* Título */}
                <h1 className="text-3xl font-bold text-base-content mb-2">
                  ¡Registro Completado!
                </h1>

                {/* Mensaje personalizado */}
                <p className="text-lg text-base-content/70 mb-4">
                  Gracias,{" "}
                  <span className="font-semibold text-primary">
                    {athleteName}
                  </span>
                </p>

                {/* Instrucciones */}
                <div className="bg-info/10 border border-info/20 rounded-xl p-6 mb-8 text-left">
                  <h3 className="font-semibold text-info mb-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    ¿Qué sigue?
                  </h3>
                  <ul className="space-y-2 text-base-content/80">
                    <li className="flex items-start gap-2">
                      <span className="badge badge-info badge-sm mt-1">1</span>
                      <span>
                        Tu registro ha sido enviado al equipo de{" "}
                        <strong>Kallpa UNL</strong>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="badge badge-info badge-sm mt-1">2</span>
                      <span>
                        Un <strong>entrenador</strong> o{" "}
                        <strong>coordinador</strong> se comunicará contigo
                        pronto.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="badge badge-info badge-sm mt-1">3</span>
                      <span>
                        Tendrás acceso a la plataforma una vez que tu registro
                        sea aprobado.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Mensaje de contacto */}
                <p className="text-sm text-base-content/60 mb-8">
                  Si tienes alguna pregunta, no dudes en contactarnos a través
                  de nuestros canales oficiales.
                </p>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Button
                    variant="ghost"
                    onClick={() => setRegistrationSuccess(false)}
                    className="flex-1"
                    icon={ArrowLeft}
                  >
                    Registrar otro deportista
                  </Button>

                  <Button
                    variant="primary"
                    onClick={() => navigate(ROUTES.LANDING)}
                    className="flex-1 rounded-full shadow-lg shadow-primary/30"
                    icon={Home}
                  >
                    Volver al inicio
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Formulario de registro
  return (
    <div className="min-h-screen bg-base-200">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(ROUTES.REGISTER)}
          className="flex items-center text-base-content/60 hover:text-base-content mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Volver
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-base-content">
            Registro para Club
          </h1>
          <p className="text-sm text-base-content/70">
            Completa los datos personales del deportista.
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <DeportistaForm
              onSubmit={handleSubmit}
              onCancel={() => navigate(ROUTES.REGISTER)}
              loading={loading}
              error={error}
              isMenor={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterClubPage;
