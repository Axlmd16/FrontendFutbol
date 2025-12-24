/**
 * ==============================================
 * Página de Registro de Deportista - Kallpa UNL
 * ==============================================
 * 
 * Página para registrar deportistas mayores de edad.
 * 
 * @author Kallpa UNL Team
 * @version 1.0.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeportistaForm from '../components/DeportistaForm';
import inscriptionApi from '../services/inscription.api';
import { ROUTES, MESSAGES } from '@/app/config/constants';

/**
 * RegisterDeportistaPage - Página de registro de deportista
 * 
 * @returns {JSX.Element} Página de registro
 */
const RegisterDeportistaPage = () => {
  // ==============================================
  // ESTADO
  // ==============================================
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  // ==============================================
  // MANEJADORES
  // ==============================================
  
  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (athleteData) => {
    setLoading(true);
    setError(null);
    
    try {
      await inscriptionApi.registerDeportista(athleteData);
      
      // TODO: Mostrar toast de éxito
      console.log(MESSAGES.SUCCESS.CREATED);
      
      // Navegar al dashboard o lista
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || MESSAGES.ERROR.GENERIC);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Maneja la cancelación
   */
  const handleCancel = () => {
    navigate(-1);
  };
  
  // ==============================================
  // RENDER
  // ==============================================
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Registro de Deportista
              </h1>
              <p className="text-sm text-gray-500">
                Completa el formulario para inscribir un nuevo deportista mayor de edad.
              </p>
            </div>
          </div>
        </div>
        
        {/* Card con formulario */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <DeportistaForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            error={error}
            isMenor={false}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterDeportistaPage;
