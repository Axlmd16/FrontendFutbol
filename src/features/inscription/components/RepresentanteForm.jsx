/**
    TODO: OJO: ESTE FORMULARIO SOLO ES DE EJEMPLO, NO FUNCIONA, NI ESTA ADAPATADO AL BACKEND
    REVISAR EL FORMULARIO DE INSCRIPCION DE DEPORTISTAS DE UNL (DEPORTISTAFORM) ESE YA FUNCIONA.
 */

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Input from "@/shared/components/Input";
import { Users, Mail, Phone, MapPin, Briefcase, UserCheck } from "lucide-react";

const RepresentanteForm = ({
  data = {},
  onChange,
  errors = {},
  disabled = false,
}) => {
  // ==============================================
  // ESTADO LOCAL
  // ==============================================

  const [formData, setFormData] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    parentesco: "",
    email: "",
    telefonoPrincipal: "",
    telefonoSecundario: "",
    direccion: "",
    ocupacion: "",
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
    { value: "padre", label: "Padre" },
    { value: "madre", label: "Madre" },
    { value: "abuelo", label: "Abuelo/a" },
    { value: "tio", label: "Tío/a" },
    { value: "hermano", label: "Hermano/a mayor" },
    { value: "tutor", label: "Tutor legal" },
    { value: "otro", label: "Otro" },
  ];

  // ==============================================
  // RENDER
  // ==============================================

  return (
    <div className="space-y-6">
      {/* ==================== SECCIÓN: DATOS DEL REPRESENTANTE ==================== */}
      <div className="pb-3 border-b border-base-300">
        <div className="flex items-center gap-2 text-base-content">
          <Users className="w-5 h-5 text-secondary" />
          <h3 className="font-semibold text-lg">Datos del Representante</h3>
        </div>
        <p className="text-sm text-base-content/60 mt-1 ml-7">
          Información del padre, madre o tutor legal del deportista menor de
          edad.
        </p>
      </div>

      {/* Campos del formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
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
          maxLength={10}
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
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-medium text-base-content">
              Parentesco <span className="text-error">*</span>
            </span>
          </label>
          <select
            name="parentesco"
            value={formData.parentesco}
            onChange={handleChange}
            disabled={disabled}
            className={`select select-bordered w-full bg-white ${
              errors.parentesco ? "select-error" : ""
            }`}
          >
            <option value="">Seleccionar...</option>
            {parentescoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.parentesco && (
            <label className="label py-1">
              <span className="label-text-alt text-error">
                {errors.parentesco}
              </span>
            </label>
          )}
        </div>

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
      </div>

      {/* ==================== SECCIÓN: INFORMACIÓN DE CONTACTO ==================== */}
      <div className="pb-3 border-b border-base-300 pt-2">
        <div className="flex items-center gap-2 text-base-content">
          <Phone className="w-5 h-5 text-secondary" />
          <h3 className="font-semibold text-lg">Información de Contacto</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
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
          maxLength={10}
        />

        {/* Teléfono Secundario */}
        <Input
          label="Teléfono Secundario"
          type="tel"
          name="telefonoSecundario"
          value={formData.telefonoSecundario}
          onChange={handleChange}
          placeholder="0998765432 (opcional)"
          error={errors.telefonoSecundario}
          disabled={disabled}
          maxLength={10}
        />

        {/* Dirección - ocupa más espacio */}
        <div className="md:col-span-2 lg:col-span-3">
          <Input
            label="Dirección"
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Av. Principal #123, Barrio Centro, Ciudad"
            error={errors.direccion}
            disabled={disabled}
            required
          />
        </div>
      </div>

      {/* Nota informativa */}
      <div className="alert alert-info text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <p className="font-medium">Importante:</p>
          <p>
            El representante será el contacto principal para todas las
            comunicaciones relacionadas con el deportista y deberá autorizar su
            participación en actividades y competencias.
          </p>
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
