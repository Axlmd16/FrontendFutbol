/**
 * ==============================================
 * Formulario de Usuario - Kallpa UNL
 * ==============================================
 * 
 * Componente de formulario para crear y editar usuarios.
 * Reutilizable para ambas operaciones.
 * 
 * @author Kallpa UNL Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import { ROLE_OPTIONS } from '@/app/config/roles';
import { VALIDATION } from '@/app/config/constants';

/**
 * UserForm - Formulario de usuario
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.initialData - Datos iniciales (para edición)
 * @param {Function} props.onSubmit - Callback al enviar
 * @param {Function} props.onCancel - Callback al cancelar
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.error - Mensaje de error
 * @param {boolean} props.isEdit - Indica si es modo edición
 * @returns {JSX.Element} Formulario de usuario
 */
const UserForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false, 
  error = null,
  isEdit = false 
}) => {
  // ==============================================
  // ESTADO
  // ==============================================
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    role: 'deportista',
    active: true,
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // ==============================================
  // EFECTOS
  // ==============================================
  
  /**
   * Cargar datos iniciales en modo edición
   */
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        username: initialData.username || '',
        email: initialData.email || '',
        password: '',
        passwordConfirmation: '',
        role: initialData.role || 'deportista',
        active: initialData.active ?? true,
      });
    }
  }, [initialData]);
  
  // ==============================================
  // VALIDACIÓN
  // ==============================================
  
  /**
   * Valida un campo específico
   */
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.length < 3) return 'Mínimo 3 caracteres';
        return '';
        
      case 'username':
        if (!value.trim()) return 'El usuario es requerido';
        if (value.length < VALIDATION.USERNAME_MIN_LENGTH) {
          return `Mínimo ${VALIDATION.USERNAME_MIN_LENGTH} caracteres`;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          return 'Solo letras, números y guión bajo';
        }
        return '';
        
      case 'email':
        if (!value.trim()) return 'El email es requerido';
        if (!VALIDATION.EMAIL_PATTERN.test(value)) {
          return 'Ingresa un email válido';
        }
        return '';
        
      case 'password':
        // En edición, la contraseña es opcional
        if (!isEdit && !value) return 'La contraseña es requerida';
        if (value && value.length < VALIDATION.PASSWORD_MIN_LENGTH) {
          return `Mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`;
        }
        return '';
        
      case 'passwordConfirmation':
        if (formData.password && !value) {
          return 'Confirma la contraseña';
        }
        if (value && value !== formData.password) {
          return 'Las contraseñas no coinciden';
        }
        return '';
        
      case 'role':
        if (!value) return 'Selecciona un rol';
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
    const fieldsToValidate = ['name', 'username', 'email', 'role'];
    
    // Agregar campos de contraseña si aplica
    if (!isEdit || formData.password) {
      fieldsToValidate.push('password', 'passwordConfirmation');
    }
    
    fieldsToValidate.forEach((field) => {
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
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    
    // Limpiar error del campo
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
      // Preparar datos a enviar
      const dataToSubmit = { ...formData };
      
      // En edición, omitir contraseña si está vacía
      if (isEdit && !dataToSubmit.password) {
        delete dataToSubmit.password;
        delete dataToSubmit.passwordConfirmation;
      }
      
      onSubmit(dataToSubmit);
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
      
      {/* Grid de campos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre completo */}
        <Input
          label="Nombre completo"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Juan Pérez"
          error={formErrors.name}
          disabled={loading}
          required
        />
        
        {/* Nombre de usuario */}
        <Input
          label="Nombre de usuario"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="juanperez"
          error={formErrors.username}
          disabled={loading}
          required
        />
        
        {/* Email */}
        <Input
          label="Correo electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="juan@email.com"
          error={formErrors.email}
          disabled={loading}
          required
        />
        
        {/* Rol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rol <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {formErrors.role && (
            <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
          )}
        </div>
        
        {/* Contraseña */}
        <Input
          label={isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña'}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={formErrors.password}
          disabled={loading}
          required={!isEdit}
        />
        
        {/* Confirmar contraseña */}
        <Input
          label="Confirmar contraseña"
          type="password"
          name="passwordConfirmation"
          value={formData.passwordConfirmation}
          onChange={handleChange}
          placeholder="••••••••"
          error={formErrors.passwordConfirmation}
          disabled={loading}
          required={!isEdit && formData.password}
        />
      </div>
      
      {/* Estado activo */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="active"
          name="active"
          checked={formData.active}
          onChange={handleChange}
          disabled={loading}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="active" className="ml-2 text-sm text-gray-700">
          Usuario activo
        </label>
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
          {isEdit ? 'Guardar cambios' : 'Crear usuario'}
        </Button>
      </div>
    </form>
  );
};

// Validación de PropTypes
UserForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  isEdit: PropTypes.bool,
};

export default UserForm;
