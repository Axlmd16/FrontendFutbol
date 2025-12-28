/**
 * ==============================================
 * Registro Club (Público) - Kallpa UNL
 * ==============================================
 *
 * Página de registro de atletas para el club.
 * Layout de dos columnas: info lateral + formulario.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PublicNavbar from "@/shared/components/PublicNavbar";
import DeportistaForm from "@/features/inscription/components/DeportistaForm";
import inscriptionApi from "@/features/inscription/services/inscription.api";
import Button from "@/shared/components/Button";
import { MESSAGES, ROUTES } from "@/app/config/constants";
import {
  CheckCircle,
  ArrowLeft,
  Home,
  UserPlus,
  Trophy,
  ClipboardList,
  Phone,
  HelpCircle,
} from "lucide-react";

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

      setAthleteName(
        `${athletePayload.first_name} ${athletePayload.last_name}`
      );

      toast.success("¡Registro exitoso!", {
        description: "Tu información ha sido registrada correctamente.",
      });

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

  // ==========================================
  // PANTALLA DE ÉXITO
  // ==========================================
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-base-200">
        <PublicNavbar />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
              <div className="bg-success py-6 px-6">
                <div className="flex flex-col items-center text-success-content">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h1 className="text-2xl font-bold text-center">
                    ¡Registro Completado!
                  </h1>
                </div>
              </div>

              <div className="card-body p-6">
                <p className="text-lg text-center text-base-content mb-4">
                  Bienvenido,{" "}
                  <span className="font-bold text-primary">{athleteName}</span>
                </p>

                <div className="bg-base-200/50 rounded-xl p-4 mb-4">
                  <ul className="steps steps-vertical lg:steps-horizontal w-full text-sm">
                    <li className="step step-success" data-content="✓">
                      Registro enviado
                    </li>
                    <li className="step" data-content="2">
                      Revisión
                    </li>
                    <li className="step" data-content="3">
                      Contacto
                    </li>
                  </ul>
                </div>

                <div className="alert alert-info text-sm mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Un entrenador se comunicará contigo pronto.</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setRegistrationSuccess(false);
                      setAthleteName("");
                    }}
                    className="flex-1"
                  >
                    <UserPlus className="w-4 h-4" />
                    Registrar otro
                  </Button>

                  <Button
                    variant="primary"
                    onClick={() => navigate(ROUTES.LANDING)}
                    className="flex-1"
                  >
                    <Home className="w-4 h-4" />
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

  // ==========================================
  // FORMULARIO DE REGISTRO (Layout 2 columnas)
  // ==========================================
  return (
    <div className="min-h-screen bg-base-200">
      <PublicNavbar />

      <main className="container mx-auto px-4 py-4">
        {/* Botón volver */}
        <button
          onClick={() => navigate(ROUTES.REGISTER)}
          className="inline-flex items-center gap-1 text-base-content/60 hover:text-primary transition-colors text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a opciones
        </button>

        {/* Layout de dos columnas */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* ========== PANEL LATERAL IZQUIERDO ========== */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-4 space-y-4">
              {/* Card de información */}
              <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-base-content">
                      Registro Club
                    </h2>
                  </div>
                  <p className="text-sm text-base-content/70">
                    Únete al Club de Fútbol de la UNL y forma parte de nuestro
                    equipo deportivo.
                  </p>
                </div>
              </div>

              {/* Stepper vertical */}
              <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body p-4">
                  <h3 className="text-sm font-semibold text-base-content mb-3">
                    Proceso
                  </h3>
                  <ul className="steps steps-vertical text-xs">
                    <li className="step step-primary">Datos personales</li>
                    <li className="step">Confirmación</li>
                    <li className="step">¡Listo!</li>
                  </ul>
                </div>
              </div>

              {/* Info de campos obligatorios */}
              <div className="card bg-info/10 border border-info/20">
                <div className="card-body p-4">
                  <div className="flex items-start gap-2">
                    <ClipboardList className="w-4 h-4 text-info mt-0.5 shrink-0" />
                    <p className="text-xs text-base-content/70">
                      Los campos marcados con{" "}
                      <span className="text-error font-bold">*</span> son
                      obligatorios.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ayuda */}
              <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-base-content/60" />
                    <h3 className="text-sm font-semibold text-base-content">
                      ¿Necesitas ayuda?
                    </h3>
                  </div>
                  <p className="text-xs text-base-content/60 mb-2">
                    Contacta al equipo de soporte.
                  </p>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Phone className="w-3 h-3" />
                    <span>07 123 4567</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ========== FORMULARIO (DERECHA) ========== */}
          <div className="flex-1">
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body p-4 lg:p-6">
                <DeportistaForm
                  onSubmit={handleSubmit}
                  onCancel={() => navigate(ROUTES.REGISTER)}
                  loading={loading}
                  error={error}
                  isMenor={false}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterClubPage;
