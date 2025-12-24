/**
 * ==============================================
 * Landing Page - Kallpa UNL
 * ==============================================
 */

import { Link } from 'react-router-dom';
import PublicNavbar from '@/shared/components/PublicNavbar';
import Button from '@/shared/components/Button';
import { ROUTES } from '@/app/config/constants';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Gestión deportiva simple,
              <span className="text-blue-600"> rápida</span> y organizada
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Registra deportistas, controla evaluaciones y consulta estadísticas.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to={ROUTES.REGISTER}>
                <Button variant="primary" className="w-full sm:w-auto">
                  Registrarse
                </Button>
              </Link>
              <Link to={ROUTES.LOGIN}>
                <Button variant="secondary" className="w-full sm:w-auto">
                  Iniciar sesión
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg border border-gray-100 p-4">
                <p className="text-sm font-semibold text-gray-900">Inscripción</p>
                <p className="text-sm text-gray-600">Escuela o Club</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-100 p-4">
                <p className="text-sm font-semibold text-gray-900">Seguimiento</p>
                <p className="text-sm text-gray-600">Evaluaciones y tests</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-100 p-4">
                <p className="text-sm font-semibold text-gray-900">Reportes</p>
                <p className="text-sm text-gray-600">Estadísticas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900">Empieza en minutos</h2>
            <p className="mt-2 text-gray-600">
              Elige el tipo de registro y completa tus datos.
            </p>

            <div className="mt-6 space-y-3">
              <Link to={ROUTES.REGISTER_SCHOOL}>
                <div className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                  <p className="font-medium text-gray-900">Registro para Escuela</p>
                  <p className="text-sm text-gray-600">Representante + Deportista menor</p>
                </div>
              </Link>
              <Link to={ROUTES.REGISTER_CLUB}>
                <div className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                  <p className="font-medium text-gray-900">Registro para Club</p>
                  <p className="text-sm text-gray-600">Registro normal (datos personales)</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Kallpa UNL
      </footer>
    </div>
  );
};

export default LandingPage;
