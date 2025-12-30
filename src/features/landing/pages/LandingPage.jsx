/**
 * ==============================================
 * Landing Page - Kallpa UNL
 * ==============================================
 * 
 * Página de inicio profesional y moderna.
 */

import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '@/shared/components/PublicNavbar';
import Button from '@/shared/components/Button';
import { ROUTES } from '@/app/config/constants';
import { 
  ClipboardList, 
  Activity, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Users 
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-base-100">
         <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-base-content mb-8 leading-tight">
              Gestión deportiva <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                simple, rápida y organizada
              </span>
            </h1>
            <p className="mt-6 text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
              La plataforma integral para escuelas formativas y clubes de alto rendimiento. 
              Registra deportistas, controla evaluaciones y consulta estadísticas en un solo lugar.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="primary" 
                size="lg" 
                className="rounded-full px-8 shadow-lg hover:shadow-primary/50"
                onClick={() => navigate(ROUTES.REGISTER)}
                icon={ArrowRight}
              >
                Comenzar ahora
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="rounded-full px-8"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-base-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-base-content mb-4">Todo lo que necesitas</h2>
            <p className="text-base-content/60 max-w-2xl mx-auto">
              Herramientas diseñadas específicamente para optimizar la gestión de tu institución deportiva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-content/5">
              <div className="card-body items-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="card-title text-xl mb-3">Inscripción Digital</h3>
                <p className="text-base-content/70">
                  Proceso de registro simplificado para escuelas y clubes. Olvídate del papeleo manual.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-content/5">
              <div className="card-body items-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 text-secondary">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="card-title text-xl mb-3">Seguimiento Físico</h3>
                <p className="text-base-content/70">
                  Registra y monitorea evaluaciones antropométricas y tests físicos de cada deportista.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-content/5">
              <div className="card-body items-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 text-accent">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <h3 className="card-title text-xl mb-3">Reportes y Datos</h3>
                <p className="text-base-content/70">
                  Visualiza estadísticas detalladas para tomar mejores decisiones en el entrenamiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-20 bg-base-100 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto bg-base-200 rounded-3xl p-8 lg:p-12 shadow-inner border border-base-300">
             <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-base-content mb-4">Empieza en minutos</h2>
              <p className="text-base-content/60">
                Elige el perfil que mejor se adapte a ti y comienza a gestionar tu carrera deportiva.
              </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to={ROUTES.REGISTER_SCHOOL} className="block group">
                  <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-content/10 hover:border-primary/50 hover:shadow-md transition-all h-full">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Escuela Formativa</h3>
                    </div>
                    <p className="text-sm text-base-content/70 pl-14">
                      Ideal para menores de edad. Registro gestionado por un representante legal.
                    </p>
                  </div>
                </Link>

                <Link to={ROUTES.REGISTER_CLUB} className="block group">
                  <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-content/10 hover:border-secondary/50 hover:shadow-md transition-all h-full">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg group-hover:text-secondary transition-colors">Club Deportivo</h3>
                    </div>
                    <p className="text-sm text-base-content/70 pl-14">
                       Para deportistas independientes o de alto rendimiento. Registro personal directo.
                    </p>
                  </div>
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-base-content font-bold text-lg mb-2">Kallpa UNL</p>
          <p className="text-base-content/60 text-sm">
            © {new Date().getFullYear()} Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
