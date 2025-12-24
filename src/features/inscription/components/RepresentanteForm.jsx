/**
 * ==============================================
 * Formulario de Representante - Kallpa UNL
 * ==============================================
 * 
 * Componente de formulario para registrar representantes
 * de deportistas menores de edad.
 * 
 * @author Kallpa UNL Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '@/shared/components/Input';
import { VALIDATION } from '@/app/config/constants';

/**
 * RepresentanteForm - Formulario de representante
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.data - Datos del representante
 * @param {Function} props.onChange - Callback al cambiar datos
 * @param {Object} props.errors - Errores de validación
 * @param {boolean} props.disabled - Estado deshabilitado
 * @returns {JSX.Element} Formulario de representante
 */
const RepresentanteForm = ({ 
  data = {}, 
  onChange, 
  errors = {},
  disabled = false 
}) => {
  // ==============================================
  // ESTADO LOCAL
  // ==============================================
  
  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    parentesco: '',
    email: '',
    telefonoPrincipal: '',
    telefonoSecundario: '',
    direccion: '',
    ocupacion: '',
    ...data,
  });
  
  // Sincronizar con datos externos
  useEffect(() => {
    if (data) {
      setFormData((prev) => ({ ...prev, ...data }));
    }
  }, [data]);
  
  // ==============================================
  // MANEJADORES
  // ==============================================
  
  /**
   * Maneja cambios en los inputs
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    
    setFormData(newData);
    onChange(newData);
  };
  
  // ==============================================
  // OPCIONES
  // ==============================================
  
  const parentescoOptions = [
    { value: 'padre', label: 'Padre' },
    { value: 'madre', label: 'Madre' },
    { value: 'abuelo', label: 'Abuelo/a' },
    { value: 'tio', label: 'Tío/a' },
    { value: 'hermano', label: 'Hermano/a mayor' },
    { value: 'tutor', label: 'Tutor legal' },
    { value: 'otro', label: 'Otro' },
  ];
  
  // ==============================================
  // RENDER
  // ==============================================
  
  return (
    <div className="space-y-6">
      {/* Título de sección */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Datos del Representante
        </h3>
        <p className="text-sm text-gray-500">
          Información del padre, madre o tutor legal del deportista menor de edad.
        </p>
      </div>
      
      {/* Campos del formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cédula */}
        <Input
          label="Cédula del Representante"
          type="text"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          placeholder="1234567890"
          error={errors.cedula}
          disabled={disabled}
          required
        />
        
        {/* Nombres */}
        <Input
          label="Nombres"
          type="text"
          name="nombres"
          value={formData.nombres}
          onChange={handleChange}
          placeholder="María Elena"
          error={errors.nombres}
          disabled={disabled}
          required
        />
        
        {/* Apellidos */}
        <Input
          label="Apellidos"
          type="text"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          placeholder="García López"
          error={errors.apellidos}
          disabled={disabled}
          required
        />
        
        {/* Parentesco */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parentesco <span className="text-red-500">*</span>
          </label>
          <select
            name="parentesco"
            value={formData.parentesco}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">Seleccionar...</option>
            {parentescoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.parentesco && (
            <p className="mt-1 text-sm text-red-600">{errors.parentesco}</p>
          )}
        </div>
        
        {/* Email */}
        <Input
          label="Correo Electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="representante@email.com"
          error={errors.email}
          disabled={disabled}
          required
        />
        
        {/* Teléfono Principal */}
        <Input
          label="Teléfono Principal"
          type="tel"
          name="telefonoPrincipal"
          value={formData.telefonoPrincipal}
          onChange={handleChange}
          placeholder="0987654321"
          error={errors.telefonoPrincipal}
          disabled={disabled}
          required
        />
        
        {/* Teléfono Secundario */}
        <Input
          label="Teléfono Secundario (opcional)"
          type="tel"
          name="telefonoSecundario"
          value={formData.telefonoSecundario}
          onChange={handleChange}
          placeholder="0998765432"
          error={errors.telefonoSecundario}
          disabled={disabled}
        />
        
        {/* Ocupación */}
        <Input
          label="Ocupación"
          type="text"
          name="ocupacion"
          value={formData.ocupacion}
          onChange={handleChange}
          placeholder="Ingeniero, Docente, etc."
          error={errors.ocupacion}
          disabled={disabled}
        />
        
        {/* Dirección - ocupa dos columnas */}
        <div className="md:col-span-2">
          <Input
            label="Dirección"
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Av. Principal #123, Barrio Centro"
            error={errors.direccion}
            disabled={disabled}
            required
          />
        </div>
      </div>
      
      {/* Nota informativa */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-700">
            <p className="font-medium">Importante:</p>
            <p>
              El representante será el contacto principal para todas las comunicaciones 
              relacionadas con el deportista y deberá autorizar su participación en 
              actividades y competencias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

RepresentanteForm.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
};

export default RepresentanteForm;
