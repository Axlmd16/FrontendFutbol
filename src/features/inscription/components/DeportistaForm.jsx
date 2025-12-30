import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import PropTypes from "prop-types";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import { User, FileText, Activity } from "lucide-react";
import {
  GENDER_OPTIONS,
  VALIDATION,
  TYPE_IDENTIFICATION_OPTIONS,
  TYPE_STAMENT_OPTIONS,
} from "@/app/config/constants";

/**
 * DeportistaForm - Formulario de deportista
 * Diseño profesional con secciones agrupadas
 */
const DeportistaForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  isMenor = false,
}) => {
  // ==============================================
  // ESTADO Y CONFIGURACIÓN
  // ==============================================

  const defaultTypeId = TYPE_IDENTIFICATION_OPTIONS?.[0]?.value ?? "dni";
  const defaultTypeStament = TYPE_STAMENT_OPTIONS?.[0]?.value ?? "estudiante";
  const defaultSex = GENDER_OPTIONS?.[0]?.value ?? "OTHER";

  const normalizedTypeIdentification = useMemo(() => {
    const raw = (initialData?.type_identification ?? "").toString().trim();
    const upper = raw.toUpperCase();
    if (upper === "CEDULA") return "dni";
    if (upper === "PASSPORT") return "passport";
    if (upper === "RUC") return "ruc";

    const lower = raw.toLowerCase();
    if (["dni", "passport", "ruc"].includes(lower)) return lower;

    return "";
  }, [initialData?.type_identification]);

  const normalizedTypeStament = useMemo(() => {
    const raw = (initialData?.type_stament ?? "").toString().trim();
    const lower = raw.toLowerCase();
    if (
      [
        "administrativos",
        "docentes",
        "estudiantes",
        "trabajadores",
        "externos",
      ].includes(lower)
    ) {
      return lower;
    }
    return "";
  }, [initialData?.type_stament]);

  const normalizedSex = useMemo(() => {
    const raw = (initialData?.sex ?? "").toString().trim();
    const upper = raw.toUpperCase();
    if (upper === "MASCULINO") return "MALE";
    if (upper === "FEMENINO") return "FEMALE";
    if (upper === "OTRO") return "OTHER";

    const lower = raw.toLowerCase();
    if (["male", "female", "other"].includes(lower)) return lower;

    return "";
  }, [initialData?.sex]);

  const defaultValues = useMemo(
    () => ({
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      birth_date: initialData?.birth_date || "",
      sex: normalizedSex || initialData?.sex || defaultSex,
      direction: initialData?.direction || "",
      type_identification:
        normalizedTypeIdentification ||
        initialData?.type_identification ||
        defaultTypeId,
      dni: initialData?.dni || "",
      phone: initialData?.phone || "",
      type_stament:
        normalizedTypeStament ||
        initialData?.type_stament ||
        defaultTypeStament,
      height: initialData?.height || "",
      weight: initialData?.weight || "",
    }),
    [
      initialData,
      normalizedSex,
      defaultSex,
      normalizedTypeIdentification,
      defaultTypeId,
      normalizedTypeStament,
      defaultTypeStament,
    ]
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onValidSubmit = (data) => {
    onSubmit(data);
  };

  const typeIdentification = useWatch({ control, name: "type_identification" });

  const identificationRules = useMemo(() => {
    switch (typeIdentification) {
      case "ruc":
        return {
          label: "RUC",
          inputMode: "numeric",
          maxLength: 13,
          placeholder: "13 dígitos",
          validate: (value) => {
            const v = (value ?? "").toString().trim();
            if (!/^\d{13}$/.test(v))
              return "El RUC debe tener exactamente 13 dígitos";
            return true;
          },
        };
      case "passport":
        return {
          label: "Pasaporte",
          inputMode: "text",
          maxLength: 15,
          placeholder: "6–15 caracteres",
          validate: (value) => {
            const v = (value ?? "").toString().trim();
            if (v.length < 6 || v.length > 15) {
              return "El pasaporte debe tener entre 6 y 15 caracteres";
            }
            if (!/^[A-Za-z0-9]+$/.test(v)) {
              return "El pasaporte solo permite caracteres alfanuméricos";
            }
            return true;
          },
        };
      case "dni":
      default:
        return {
          label: "Cédula",
          inputMode: "numeric",
          maxLength: 10,
          placeholder: "10 dígitos",
          validate: (value) => {
            const v = (value ?? "").toString().trim();
            if (!/^\d{10}$/.test(v))
              return "La cédula debe tener exactamente 10 dígitos";
            return true;
          },
        };
    }
  }, [typeIdentification]);

  // ==============================================
  // COMPONENTE DE SECCIÓN
  // ==============================================

  const SectionHeader = ({ icon: Icon, title, color = "primary" }) => (
    <div
      className={`flex items-center gap-3 mb-4 pb-2 border-b border-base-200`}
    >
      <div className={`p-2 bg-${color}/10 rounded-lg`}>
        <Icon className={`w-5 h-5 text-${color}`} />
      </div>
      <h3 className="text-lg font-semibold text-base-content">{title}</h3>
    </div>
  );

  // ==============================================
  // RENDER
  // ==============================================

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      className="space-y-8"
      noValidate
    >
      {/* Error del servidor */}
      {error && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* ============================================== */}
      {/* SECCIÓN 1: DATOS PERSONALES */}
      {/* ============================================== */}
      <section>
        <SectionHeader icon={User} title="Datos Personales" color="primary" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Nombres */}
          <Input
            label="Nombres"
            type="text"
            name="first_name"
            placeholder="Ej: Juan Carlos"
            error={errors.first_name?.message}
            disabled={loading}
            required
            {...register("first_name", {
              required: "El nombre es requerido",
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
            })}
          />

          {/* Apellidos */}
          <Input
            label="Apellidos"
            type="text"
            name="last_name"
            placeholder="Ej: Pérez García"
            error={errors.last_name?.message}
            disabled={loading}
            required
            {...register("last_name", {
              required: "El apellido es requerido",
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
            })}
          />

          {/* Fecha de nacimiento */}
          <Input
            label="Fecha de nacimiento"
            type="date"
            name="birth_date"
            error={errors.birth_date?.message}
            disabled={loading}
            required
            {...register("birth_date", {
              required: "La fecha de nacimiento es requerida",
            })}
          />

          {/* Sexo */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Sexo <span className="text-error">*</span>
              </span>
            </label>
            <select
              className={`select select-bordered w-full bg-white${
                errors.sex ? "select-error" : ""
              }`}
              disabled={loading}
              {...register("sex", {
                required: "El sexo es requerido",
              })}
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.sex && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.sex.message}
                </span>
              </label>
            )}
          </div>

          {/* Tipo de identificación */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Tipo de documento <span className="text-error">*</span>
              </span>
            </label>
            <select
              className={`select select-bordered w-full bg-white${
                errors.type_identification ? "select-error" : ""
              }`}
              disabled={loading}
              {...register("type_identification", {
                required: "Selecciona un tipo de identificación",
              })}
            >
              {TYPE_IDENTIFICATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.type_identification && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.type_identification.message}
                </span>
              </label>
            )}
          </div>

          {/* Número de identificación */}
          <Input
            label="Número de documento"
            type="text"
            name="dni"
            placeholder={identificationRules.placeholder}
            error={errors.dni?.message}
            disabled={loading}
            required
            inputMode={identificationRules.inputMode}
            maxLength={identificationRules.maxLength}
            {...register("dni", {
              required: "El número de identificación es requerido",
              validate: identificationRules.validate,
            })}
          />
        </div>
      </section>

      {/* ============================================== */}
      {/* SECCIÓN 2: INFORMACIÓN DE CONTACTO (Solo mayores) */}
      {/* ============================================== */}
      {!isMenor && (
        <section>
          <SectionHeader
            icon={FileText}
            title="Información de Contacto"
            color="secondary"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Teléfono */}
            <Input
              label="Teléfono"
              type="text"
              name="phone"
              placeholder="Ej: 0987654321"
              error={errors.phone?.message}
              disabled={loading}
              inputMode="numeric"
              maxLength={10}
              {...register("phone", {
                validate: (value) => {
                  const v = (value ?? "").toString().trim();
                  if (!v) return true;
                  if (!/^\d{10}$/.test(v))
                    return "El teléfono debe tener exactamente 10 dígitos";
                  return true;
                },
              })}
            />

            {/* Estamento */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Estamento <span className="text-error">*</span>
                </span>
              </label>
              <select
                className={`select select-bordered w-full bg-white${
                  errors.type_stament ? "select-error" : ""
                }`}
                disabled={loading}
                {...register("type_stament", {
                  required: "Selecciona un estamento",
                })}
              >
                {TYPE_STAMENT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.type_stament && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.type_stament.message}
                  </span>
                </label>
              )}
            </div>

            {/* Dirección - Ocupa todo el ancho */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Input
                label="Dirección"
                type="text"
                name="direction"
                placeholder="Av. Principal #123"
                error={errors.direction?.message}
                disabled={loading}
                {...register("direction")}
              />
            </div>
          </div>
        </section>
      )}

      {/* ============================================== */}
      {/* SECCIÓN 3: DATOS FÍSICOS */}
      {/* ============================================== */}
      <section>
        <SectionHeader
          icon={Activity}
          title="Datos Físicos (Opcional)"
          color="accent"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Altura */}
          <Input
            label="Altura (metros)"
            type="text"
            name="height"
            placeholder="Ej: 1.75"
            error={errors.height?.message}
            disabled={loading}
            {...register("height")}
          />

          {/* Peso */}
          <Input
            label="Peso (kg)"
            type="text"
            name="weight"
            placeholder="Ej: 70"
            error={errors.weight?.message}
            disabled={loading}
            {...register("weight")}
          />
        </div>
      </section>

      {/* ============================================== */}
      {/* BOTONES DE ACCIÓN */}
      {/* ============================================== */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-base-200">
        <Button
          type="button"
          variant="ghost"
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
          className="shadow-lg shadow-primary/20"
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
