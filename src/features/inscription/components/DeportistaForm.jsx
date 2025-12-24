/**
 * ==============================================
 * Formulario de Deportista - Kallpa UNL
 * ==============================================
 * 
 * Componente de formulario para registrar deportistas.
 * 
 * @author Kallpa UNL Team
 * @version 1.0.0
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import { GENDER_OPTIONS, SPORT_CATEGORIES, VALIDATION } from '@/app/config/constants';

/**
 * DeportistaForm - Formulario de deportista
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.initialData - Datos iniciales
 * @param {Function} props.onSubmit - Callback al enviar
 * @param {Function} props.onCancel - Callback al cancelar
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.error - Mensaje de error
 * @param {boolean} props.isMenor - Indica si es menor de edad
 * @returns {JSX.Element} Formulario de deportista
 */
const DeportistaForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false, 
  error = null,
  isMenor = false 
}) => {
  // ==============================================
  // ESTADO
  // ==============================================
  
  const [formData, setFormData] = useState({
    cedula: initialData?.cedula || '',
    nombres: initialData?.nombres || '',
    apellidos: initialData?.apellidos || '',
    fechaNacimiento: initialData?.fechaNacimiento || '',
    genero: initialData?.genero || '',
    email: initialData?.email || '',
    telefono: initialData?.telefono || '',
    direccion: initialData?.direccion || '',
    categoria: initialData?.categoria || '',
    posicion: initialData?.posicion || '',
    peso: initialData?.peso || '',
    altura: initialData?.altura || '',
    observaciones: initialData?.observaciones || '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // ==============================================
  // VALIDACIÓN
  // ==============================================
  
  /**
   * Valida un campo específico
   */
  const validateField = (name, value) => {
    switch (name) {
      case 'cedula':
        if (!value.trim()) return 'La cédula es requerida';
        if (!VALIDATION.CI_PATTERN.test(value)) {
          return 'Ingresa una cédula válida (10 dígitos)';
        }
        return '';
        
      case 'nombres':
        if (!value.trim()) return 'Los nombres son requeridos';
        if (value.length < 2) return 'Mínimo 2 caracteres';
        return '';
        
      case 'apellidos':
        if (!value.trim()) return 'Los apellidos son requeridos';
        if (value.length < 2) return 'Mínimo 2 caracteres';
        return '';
        
      case 'fechaNacimiento':
        if (!value) return 'La fecha de nacimiento es requerida';
        return '';
        
      case 'genero':
        if (!value) return 'El género es requerido';
        return '';
        
      case 'email':
        if (!isMenor && !value.trim()) return 'El email es requerido';
        if (value && !VALIDATION.EMAIL_PATTERN.test(value)) {
          return 'Ingresa un email válido';
        }
        return '';
        
      case 'telefono':
        if (!isMenor && !value.trim()) return 'El teléfono es requerido';
        if (value && !VALIDATION.PHONE_PATTERN.test(value)) {
          return 'Ingresa un teléfono válido (10 dígitos)';
        }
        return '';
        
      case 'categoria':
        if (!value) return 'La categoría es requerida';
        return '';
        
      default:
        return '';
    }
  };
  
  /**
   * Valida todo el formulario
   */
  const validateForm = () => {
    const errors = {};
    const requiredFields = ['cedula', 'nombres', 'apellidos', 'fechaNacimiento', 'genero', 'categoria'];
    
    if (!isMenor) {
      requiredFields.push('email', 'telefono');
    }
    
    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // ==============================================
  // MANEJADORES
  // ==============================================
  
  /**
   * Maneja cambios en los inputs
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  // ==============================================
  // RENDER
  // ==============================================
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error del servidor */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* Sección: Datos Personales */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Datos Personales
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Cédula"
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            placeholder="1234567890"
            error={formErrors.cedula}
            disabled={loading}
            required
          />
          
          <Input
            label="Nombres"
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            placeholder="Juan Carlos"
            error={formErrors.nombres}
            disabled={loading}
            required
          />
          
          <Input
            label="Apellidos"
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            placeholder="Pérez García"
            error={formErrors.apellidos}
            disabled={loading}
            required
          />
          
          <Input
            label="Fecha de Nacimiento"
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            error={formErrors.fechaNacimiento}
            disabled={loading}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Género <span className="text-red-500">*</span>
            </label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar...</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formErrors.genero && (
              <p className="mt-1 text-sm text-red-600">{formErrors.genero}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar...</option>
              {SPORT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {formErrors.categoria && (
              <p className="mt-1 text-sm text-red-600">{formErrors.categoria}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Sección: Contacto (solo mayores) */}
      {!isMenor && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Información de Contacto
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              error={formErrors.email}
              disabled={loading}
              required
            />
            
            <Input
              label="Teléfono"
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="0987654321"
              error={formErrors.telefono}
              disabled={loading}
              required
            />
            
            <div className="md:col-span-2">
              <Input
                label="Dirección"
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Av. Principal #123"
                error={formErrors.direccion}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Sección: Datos Deportivos */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Datos Deportivos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Posición"
            type="text"
            name="posicion"
            value={formData.posicion}
            onChange={handleChange}
            placeholder="Delantero"
            disabled={loading}
          />
          
          <Input
            label="Peso (kg)"
            type="number"
            name="peso"
            value={formData.peso}
            onChange={handleChange}
            placeholder="70"
            disabled={loading}
          />
          
          <Input
            label="Altura (cm)"
            type="number"
            name="altura"
            value={formData.altura}
            onChange={handleChange}
            placeholder="175"
            disabled={loading}
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones
          </label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Observaciones adicionales..."
            disabled={loading}
          />
        </div>
      </div>
      
      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          Registrar deportista
        </Button>
      </div>
    </form>
  );
};

DeportistaForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  isMenor: PropTypes.bool,
};

export default DeportistaForm;
