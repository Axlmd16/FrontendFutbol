/**
 * ==============================================
 * Registro Escuela (Público) - Kallpa UNL
 * ==============================================
 * 
 * Flujo: Representante -> Deportista menor.
 * Después de registrar, redirige a login.
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '@/shared/components/PublicNavbar';
import Button from '@/shared/components/Button';
import RepresentanteForm from '@/features/inscription/components/RepresentanteForm';
import DeportistaForm from '@/features/inscription/components/DeportistaForm';
import inscriptionApi from '@/features/inscription/services/inscription.api';
import { MESSAGES, ROUTES, VALIDATION } from '@/app/config/constants';

const RegisterSchoolPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [representanteData, setRepresentanteData] = useState({});
  const [representanteErrors, setRepresentanteErrors] = useState({});
  const [athleteData, setAthleteData] = useState(null);

  const stepTitle = useMemo(() => {
    if (step === 1) return 'Datos del Representante';
    return 'Datos del Deportista (Menor)';
  }, [step]);

  const validateRepresentante = () => {
    const errors = {};

    if (!representanteData.cedula?.trim()) {
      errors.cedula = 'La cédula es requerida';
    } else if (!VALIDATION.CI_PATTERN.test(representanteData.cedula)) {
      errors.cedula = 'Ingresa una cédula válida';
    }

    if (!representanteData.nombres?.trim()) errors.nombres = 'Los nombres son requeridos';
    if (!representanteData.apellidos?.trim()) errors.apellidos = 'Los apellidos son requeridos';
    if (!representanteData.parentesco) errors.parentesco = 'El parentesco es requerido';

    if (!representanteData.email?.trim()) {
      errors.email = 'El email es requerido';
    } else if (!VALIDATION.EMAIL_PATTERN.test(representanteData.email)) {
      errors.email = 'Ingresa un email válido';
    }

    if (!representanteData.telefonoPrincipal?.trim()) {
      errors.telefonoPrincipal = 'El teléfono es requerido';
    } else if (!VALIDATION.PHONE_PATTERN.test(representanteData.telefonoPrincipal)) {
      errors.telefonoPrincipal = 'Ingresa un teléfono válido';
    }

    if (!representanteData.direccion?.trim()) errors.direccion = 'La dirección es requerida';

    setRepresentanteErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      return;
    }
    navigate(ROUTES.REGISTER);
  };

  const handleContinueFromRepresentative = () => {
    setError(null);
    if (!validateRepresentante()) return;
    setStep(2);
  };

  const handleSubmitSchool = async (athletePayload) => {
    setLoading(true);
    setError(null);

    try {
      setAthleteData(athletePayload);
      await inscriptionApi.registerMenor({
        athlete: athletePayload,
        representative: representanteData,
      });

      navigate(ROUTES.LOGIN, {
        replace: true,
        state: { message: 'Registro completado. Ahora puedes iniciar sesión.' },
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
        <button onClick={goBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Registro para Escuela</h1>
          <p className="text-sm text-gray-600">Paso {step} de 2 · {stepTitle}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {error ? (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          ) : null}

          {step === 1 ? (
            <>
              <RepresentanteForm
                data={representanteData}
                onChange={(data) => {
                  setRepresentanteData(data);
                  if (Object.keys(representanteErrors).length) setRepresentanteErrors({});
                }}
                errors={representanteErrors}
                disabled={loading}
              />

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                <Button variant="secondary" onClick={() => navigate(ROUTES.LANDING)} disabled={loading}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleContinueFromRepresentative} disabled={loading}>
                  Continuar
                </Button>
              </div>
            </>
          ) : (
            <DeportistaForm
              initialData={athleteData}
              onSubmit={handleSubmitSchool}
              onCancel={goBack}
              loading={loading}
              error={error}
              isMenor
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default RegisterSchoolPage;
