/**
 * ==============================================
 * Navbar Público - Kallpa UNL
 * ==============================================
 * 
 * Navbar moderno con efecto glass para páginas públicas.
 */

import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/app/config/constants';
import Button from './Button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const PublicNavbar = ({ showAuthButtons = true }) => {
  const location = useLocation();
  const isLogin = location.pathname === ROUTES.LOGIN;
  const isRegister = location.pathname.startsWith(ROUTES.REGISTER);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="navbar bg-base-100 shadow-lg border-b border-base-content/10">
        <div className="navbar-start">
          <Link to={ROUTES.LANDING} className="btn btn-ghost text-xl normal-case gap-2 px-2 sm:px-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-content font-bold">
              K
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="font-bold text-base-content">Kallpa UNL</span>
            </div>
          </Link>
        </div>

        <div className="navbar-end gap-2">
          {showAuthButtons && (
            <>
              {/* Desktop Menu */}
              <div className="hidden sm:flex items-center gap-2">
                <Link to={ROUTES.LOGIN} tabIndex={-1}>
                  <Button 
                    variant={isLogin ? 'primary' : 'ghost'} 
                    size="sm"
                    className={isLogin ? '' : 'text-base-content/70 hover:text-primary'}
                    disabled={isLogin}
                  >
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER} tabIndex={-1}>
                  <Button 
                    variant={isRegister ? 'primary' : 'primary'} 
                    size="sm"
                    disabled={isRegister}
                    className={isRegister ? 'btn-disabled opacity-50' : ''}
                  >
                    Registrarse
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="sm:hidden">
                 <button 
                  className="btn btn-square btn-ghost" 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && showAuthButtons && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-base-100 border-b border-base-content/5 shadow-lg p-4 flex flex-col gap-3 animate-in slide-in-from-top-2">
           <Link to={ROUTES.LOGIN} onClick={() => setIsMenuOpen(false)}>
              <Button 
                variant={isLogin ? 'primary' : 'ghost'} 
                fullWidth
                disabled={isLogin}
              >
                Iniciar sesión
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER} onClick={() => setIsMenuOpen(false)}>
              <Button 
                variant={isRegister ? 'primary' : 'primary'} 
                fullWidth
                disabled={isRegister}
              >
                Registrarse
              </Button>
            </Link>
        </div>
      )}
    </header>
  );
};

PublicNavbar.propTypes = {
  showAuthButtons: PropTypes.bool,
};

export default PublicNavbar;
