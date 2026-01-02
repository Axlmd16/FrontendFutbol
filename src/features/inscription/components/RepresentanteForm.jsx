/**
 * RepresentanteForm - Formulario de datos del representante
 * Campos adaptados al backend: POST /athletes/register-minor
 */

import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Input from "@/shared/components/Input";
import { Users, Phone } from "lucide-react";
import { RELATIONSHIP_TYPE_OPTIONS, VALIDATION } from "@/app/config/constants";

const RepresentanteForm = ({
  initialData = null,
  onChange,
  errors: externalErrors = {},
  disabled = false,
}) => {
  // Ref para evitar llamar onChange en el primer render
  const isFirstRender = useRef(true);

  // Valores por defecto
  const defaultValues = useMemo(
    () => ({
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      dni: initialData?.dni || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      direction: initialData?.direction || "",
      relationship_type: initialData?.relationship_type || "",
    }),
    [initialData]
  );

  const {
    register,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues,
  });

  // Sincronizar con datos externos (solo cuando initialData cambia desde afuera)
  useEffect(() => {
    if (initialData) {
      reset(defaultValues);
    }
  }, [initialData, defaultValues, reset]);

  // Suscribirse a cambios del formulario usando watch callback
  useEffect(() => {
    const subscription = watch((data) => {
      // Evitar el primer render para no causar loop
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      if (onChange) {
        onChange(data);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  // Header de sección
  const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="pb-3 border-b border-base-300">
      <div className="flex items-center gap-2 text-base-content">
        <Icon className="w-5 h-5 text-secondary" />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      {subtitle && (
        <p className="text-sm text-base-content/60 mt-1 ml-7">{subtitle}</p>
      )}
    </div>
  );

  // Combinar errores internos y externos
  const getError = (field) =>
    errors[field]?.message || externalErrors[field] || null;

  return (
    <div className="space-y-6">
      {/* ==================== SECCIÓN: DATOS DEL REPRESENTANTE ==================== */}
      <SectionHeader
        icon={Users}
        title="Datos del Representante"
        subtitle="Información del padre, madre o tutor legal del deportista menor de edad."
      />

      {/* Campos del formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
        {/* DNI */}
        <Input
          label="Cédula del Representante"
          type="text"
          placeholder="1234567890"
          error={getError("dni")}
          disabled={disabled}
          required
          maxLength={10}
          inputMode="numeric"
          {...register("dni", {
            required: "La cédula es requerida",
            pattern: {
              value: VALIDATION.CI_PATTERN,
              message: "Ingresa una cédula válida (10 dígitos)",
            },
          })}
        />

        {/* Nombres */}
        <Input
          label="Nombres"
          type="text"
          placeholder="María Elena"
          error={getError("first_name")}
          disabled={disabled}
          required
          {...register("first_name", {
            required: "Los nombres son requeridos",
            minLength: { value: 2, message: "Mínimo 2 caracteres" },
          })}
        />

        {/* Apellidos */}
        <Input
          label="Apellidos"
          type="text"
          placeholder="García López"
          error={getError("last_name")}
          disabled={disabled}
          required
          {...register("last_name", {
            required: "Los apellidos son requeridos",
            minLength: { value: 2, message: "Mínimo 2 caracteres" },
          })}
        />

        {/* Parentesco */}
        <div className="flex flex-col">
          <label className="py-0.5">
            <span className="label-text text-xs font-medium text-slate-600">
              Parentesco
            </span>
          </label>
          <select
            error={getError("relationship_type")}
            className="select w-full select-sm"
            required
            {...register("relationship_type", {
              required: "El parentesco es requerido",
            })}
          >
            <option value="">Seleccionar...</option>
            {RELATIONSHIP_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Teléfono */}
        <Input
          label="Teléfono"
          type="tel"
          placeholder="0987654321"
          error={getError("phone")}
          disabled={disabled}
          maxLength={10}
          inputMode="numeric"
          {...register("phone")}
        />

        {/* Email */}
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="representante@email.com (opcional)"
          error={getError("email")}
          disabled={disabled}
          {...register("email", {
            pattern: {
              value: VALIDATION.EMAIL_PATTERN,
              message: "Ingresa un email válido",
            },
          })}
        />

        {/* Dirección - ocupa más espacio */}
        <div className="md:col-span-2 lg:col-span-3">
          <Input
            label="Dirección"
            type="text"
            placeholder="Av. Principal #123, Barrio Centro, Ciudad"
            error={getError("direction")}
            disabled={disabled}
            {...register("direction")}
          />
        </div>
      </div>

      {/* ==================== SECCIÓN: INFORMACIÓN DE CONTACTO ==================== */}
      <div className="pb-3 border-b border-base-300 pt-2">
        <div className="flex items-center gap-2 text-base-content">
          <Phone className="w-5 h-5 text-secondary" />
          <h3 className="font-semibold text-lg">Información Importante</h3>
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
  initialData: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
};

export default RepresentanteForm;
