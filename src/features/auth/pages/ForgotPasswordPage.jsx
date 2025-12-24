/**
 * ==============================================
 * Página de Recuperar Contraseña - Kallpa UNL
 * ==============================================
 * 
 * Permite solicitar el envío de un email para
 * restablecer la contraseña olvidada.
 * 
 * @author Kallpa UNL Team
 * @version 1.0.0
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import useAuth from '../hooks/useAuth';
import { ROUTES } from '@/app/config/constants';

/**
 * ForgotPasswordPage - Página para solicitar recuperación de contraseña
 * 
 * @returns {JSX.Element} Página de recuperación de contraseña
 */
const ForgotPasswordPage = () => {
  // ==============================================
  // ESTADO
  // ==============================================
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // Hook de autenticación
  const { forgotPassword, loading, error, clearError } = useAuth();
  
  // ==============================================
  // VALIDACIÓN
  // ==============================================
  
  /**
   * Valida el email ingresado
   * @returns {boolean} true si es válido
   */
  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('El email es requerido');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Ingresa un email válido');
      return false;
    }
    
    setEmailError('');
    return true;
  };
  
  // ==============================================
  // MANEJADORES
  // ==============================================
  
  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento de submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (validateEmail()) {
      const success = await forgotPassword(email);
      if (success) {
        setSubmitted(true);
      }
    }
  };
  
  /**
   * Maneja cambios en el input de email
   * @param {Event} e - Evento de cambio
   */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };
  
  // ==============================================
  // RENDER - ESTADO DE ÉXITO
  // ==============================================
  
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Icono de éxito */}
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Revisa tu correo!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Si existe una cuenta con el email <strong>{email}</strong>, 
              recibirás instrucciones para restablecer tu contraseña.
            </p>
            
            <Link
              to={ROUTES.LOGIN}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // ==============================================
  // RENDER - FORMULARIO
  // ==============================================
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-10 w-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="mt-2 text-gray-600">
              Ingresa tu email y te enviaremos instrucciones para recuperarla.
            </p>
          </div>
          
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error del servidor */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {/* Campo de email */}
            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="tu@email.com"
              error={emailError}
              disabled={loading}
              required
              autoComplete="email"
            />
            
            {/* Botón de envío */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Enviar instrucciones
            </Button>
            
            {/* Link para volver */}
            <div className="text-center">
              <Link
                to={ROUTES.LOGIN}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                ← Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
