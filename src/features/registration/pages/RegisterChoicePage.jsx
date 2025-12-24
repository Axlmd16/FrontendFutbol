/**
 * ==============================================
 * Página de Elección de Registro - Kallpa UNL
 * ==============================================
 * 
 * Permite elegir si se registrará a la escuela o al club.
 * Esta ruta es pública.
 */

import { useNavigate } from 'react-router-dom';
import PublicNavbar from '@/shared/components/PublicNavbar';
import Button from '@/shared/components/Button';
import { ROUTES } from '@/app/config/constants';

const RegisterChoicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Registrarse</h1>
          <p className="text-sm text-gray-600">
            Elige el tipo de registro para continuar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900">Escuela</h2>
            <p className="mt-2 text-sm text-gray-600">
              Registro para deportista menor: primero representante y luego datos del menor.
            </p>
            <div className="mt-5">
              <Button variant="primary" onClick={() => navigate(ROUTES.REGISTER_SCHOOL)} fullWidth>
                Registrar en Escuela
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900">Club</h2>
            <p className="mt-2 text-sm text-gray-600">
              Registro normal con datos personales del deportista.
            </p>
            <div className="mt-5">
              <Button variant="secondary" onClick={() => navigate(ROUTES.REGISTER_CLUB)} fullWidth>
                Registrar en Club
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="ghost" onClick={() => navigate(ROUTES.LANDING)}>
            Volver al inicio
          </Button>
        </div>
      </main>
    </div>
  );
};

export default RegisterChoicePage;
