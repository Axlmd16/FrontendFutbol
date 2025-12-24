/**
 * ==============================================
 * Navbar Público - Kallpa UNL
 * ==============================================
 * 
 * Navbar simple para páginas públicas: Landing, Login, Registro.
 */

import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/app/config/constants';
import Button from './Button';

const PublicNavbar = ({ showAuthButtons = true }) => {
  const location = useLocation();
  const isLogin = location.pathname === ROUTES.LOGIN;
  const isRegister = location.pathname.startsWith(ROUTES.REGISTER);

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link to={ROUTES.LANDING} className="flex items-center gap-2">
            <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-gray-900">Kallpa UNL</p>
              <p className="text-xs text-gray-500">Gestión Deportiva</p>
            </div>
          </Link>

          {showAuthButtons ? (
            <div className="flex items-center gap-2">
              <Link to={ROUTES.LOGIN} className={isLogin ? 'pointer-events-none' : ''}>
                <Button variant={isLogin ? 'secondary' : 'ghost'}>
                  Iniciar sesión
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER} className={isRegister ? 'pointer-events-none' : ''}>
                <Button variant={isRegister ? 'secondary' : 'primary'}>
                  Registrarse
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

PublicNavbar.propTypes = {
  showAuthButtons: PropTypes.bool,
};

export default PublicNavbar;
