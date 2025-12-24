import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import { ROUTES } from '@/app/config/constants';


const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'El email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Ingresa un email válido';
        }
        return '';
        
      case 'password':
        if (!value) return 'La contraseña es requerida';
        if (value.length < 6) return 'Mínimo 6 caracteres';
        return '';
        
      default:
        return '';
    }
  };
  
  /**
   * Valida todo el formulario
   * @returns {boolean} true si es válido
   */
  const validateForm = () => {
    const errors = {};
    
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // ==============================================
  // MANEJADORES DE EVENTOS
  // ==============================================
  
  /**
   * Maneja cambios en los inputs
   * @param {Event} e - Evento de cambio
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Validar campo si ya fue tocado
    if (touched[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };
  
  /**
   * Maneja cuando un campo pierde el foco
   * @param {Event} e - Evento de blur
   */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };
  
  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento de submit
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    setTouched({
      email: true,
      password: true,
    });
    
    // Validar formulario completo
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  // ==============================================
  // RENDER
  // ==============================================
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mensaje de error del servidor */}
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
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="tu@email.com"
        error={formErrors.email}
        disabled={loading}
        required
        autoComplete="email"
      />
      
      {/* Campo de contraseña */}
      <Input
        label="Contraseña"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="••••••••"
        error={formErrors.password}
        disabled={loading}
        required
        autoComplete="current-password"
      />
      
      {/* Opciones adicionales */}
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">Recordarme</span>
        </label>
        
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      
      {/* Botón de envío */}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        Iniciar sesión
      </Button>
    </form>
  );
};

// Validación de PropTypes
LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default LoginForm;
