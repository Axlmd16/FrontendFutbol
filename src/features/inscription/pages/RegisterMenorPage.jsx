/**
 * ==============================================
 * Página de Registro de Menor - Kallpa UNL
 * ==============================================
 * 
 * Página para registrar deportistas menores de edad
 * junto con los datos de su representante.
 * 
 * @author Kallpa UNL Team
 * @version 1.0.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeportistaForm from '../components/DeportistaForm';
import RepresentanteForm from '../components/RepresentanteForm';
import Button from '@/shared/components/Button';
import inscriptionApi from '../services/inscription.api';
import { ROUTES, MESSAGES, VALIDATION } from '@/app/config/constants';

/**
 * RegisterMenorPage - Página de registro de menor
 * 
 * @returns {JSX.Element} Página de registro de menor
 */
const RegisterMenorPage = () => {
  // ==============================================
  // ESTADO
  // ==============================================
  
  // Paso actual del wizard
  const [currentStep, setCurrentStep] = useState(1);
  
  // Datos del deportista
  const [athleteData, setAthleteData] = useState(null);
  
  // Datos del representante
  const [representanteData, setRepresentanteData] = useState({});
  const [representanteErrors, setRepresentanteErrors] = useState({});
  
  // Estados de carga y error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  // ==============================================
  // VALIDACIÓN DEL REPRESENTANTE
  // ==============================================
  
  /**
   * Valida los datos del representante
   */
  const validateRepresentante = () => {
    const errors = {};
    
    if (!representanteData.cedula?.trim()) {
      errors.cedula = 'La cédula es requerida';
    } else if (!VALIDATION.CI_PATTERN.test(representanteData.cedula)) {
      errors.cedula = 'Ingresa una cédula válida';
    }
    
    if (!representanteData.nombres?.trim()) {
      errors.nombres = 'Los nombres son requeridos';
    }
    
    if (!representanteData.apellidos?.trim()) {
      errors.apellidos = 'Los apellidos son requeridos';
    }
    
    if (!representanteData.parentesco) {
      errors.parentesco = 'El parentesco es requerido';
    }
    
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
    
    if (!representanteData.direccion?.trim()) {
      errors.direccion = 'La dirección es requerida';
    }
    
    setRepresentanteErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // ==============================================
  // MANEJADORES
  // ==============================================
  
  /**
   * Maneja el envío del paso 1 (deportista)
   */
  const handleAthleteSubmit = (data) => {
    setAthleteData(data);
    setCurrentStep(2);
  };
  
  /**
   * Maneja cambios en el formulario de representante
   */
  const handleRepresentanteChange = (data) => {
    setRepresentanteData(data);
    // Limpiar errores del campo modificado
    if (Object.keys(representanteErrors).length > 0) {
      setRepresentanteErrors({});
    }
  };
  
  /**
   * Maneja el envío final del formulario
   */
  const handleFinalSubmit = async () => {
    // Validar representante
    if (!validateRepresentante()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await inscriptionApi.registerMenor({
        athlete: athleteData,
        representative: representanteData,
      });
      
      // TODO: Mostrar toast de éxito
      console.log(MESSAGES.SUCCESS.CREATED);
      
      // Navegar al dashboard
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || MESSAGES.ERROR.GENERIC);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Vuelve al paso anterior
   */
  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      navigate(-1);
    }
  };
  
  /**
   * Maneja la cancelación
   */
  const handleCancel = () => {
    navigate(-1);
  };
  
  // ==============================================
  // RENDER - INDICADOR DE PASOS
  // ==============================================
  
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {/* Paso 1 */}
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > 1 ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : '1'}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-900">Deportista</span>
        </div>
        
        {/* Línea conectora */}
        <div className={`w-16 h-1 mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        
        {/* Paso 2 */}
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <span className="ml-2 text-sm font-medium text-gray-900">Representante</span>
        </div>
      </div>
    </div>
  );
  
  // ==============================================
  // RENDER
  // ==============================================
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {currentStep === 1 ? 'Volver' : 'Paso anterior'}
          </button>
          
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Registro de Deportista Menor
              </h1>
              <p className="text-sm text-gray-500">
                Registra al deportista y su representante legal.
              </p>
            </div>
          </div>
        </div>
        
        {/* Indicador de pasos */}
        {renderStepIndicator()}
        
        {/* Card con formulario */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Paso 1: Datos del deportista */}
          {currentStep === 1 && (
            <DeportistaForm
              initialData={athleteData}
              onSubmit={handleAthleteSubmit}
              onCancel={handleCancel}
              loading={false}
              error={null}
              isMenor={true}
            />
          )}
          
          {/* Paso 2: Datos del representante */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Error del servidor */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              {/* Resumen del deportista */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Deportista a registrar:</h4>
                <p className="text-gray-600">
                  {athleteData?.nombres} {athleteData?.apellidos} - CI: {athleteData?.cedula}
                </p>
              </div>
              
              {/* Formulario de representante */}
              <RepresentanteForm
                data={representanteData}
                onChange={handleRepresentanteChange}
                errors={representanteErrors}
                disabled={loading}
              />
              
              {/* Botones */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Anterior
                </Button>
                
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleFinalSubmit}
                  loading={loading}
                  disabled={loading}
                >
                  Completar registro
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterMenorPage;
