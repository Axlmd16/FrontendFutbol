import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import PropTypes from "prop-types";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import { User, Phone, Activity, Save } from "lucide-react";
import {
  GENDER_OPTIONS,
  TYPE_IDENTIFICATION_OPTIONS,
  TYPE_STAMENT_OPTIONS,
} from "@/app/config/constants";

/**
 * DeportistaForm - Formulario de deportista optimizado para llenar pantalla sin scroll
 */
const DeportistaForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  isMenor = false,
}) => {
  // Valores por defecto
  const defaultTypeId = TYPE_IDENTIFICATION_OPTIONS?.[0]?.value ?? "dni";
  const defaultTypeStament = TYPE_STAMENT_OPTIONS?.[0]?.value ?? "estudiante";
  const defaultSex = GENDER_OPTIONS?.[0]?.value ?? "OTHER";

  // Normalización de datos
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
    // Handle Spanish values
    if (upper === "MASCULINO") return "MALE";
    if (upper === "FEMENINO") return "FEMALE";
    if (upper === "OTRO") return "OTHER";
    // Handle backend enum values: "Male", "Female", "Other" or "MALE", "FEMALE", "OTHER"
    if (upper === "MALE") return "MALE";
    if (upper === "FEMALE") return "FEMALE";
    if (upper === "OTHER") return "OTHER";
    return "";
  }, [initialData?.sex]);

  const defaultValues = useMemo(
    () => ({
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      // Backend returns 'date_of_birth', form uses 'birth_date'
      birth_date: initialData?.date_of_birth || initialData?.birth_date || "",
      sex: normalizedSex || initialData?.sex || defaultSex,
      direction: initialData?.direction || "",
      type_identification:
        normalizedTypeIdentification ||
        initialData?.type_identification ||
        defaultTypeId,
      dni: initialData?.dni || "",
      phone: initialData?.phone || "",
      // Backend returns 'type_stament' from MS, fallback to 'type_athlete' from local data
      type_stament:
        normalizedTypeStament ||
        initialData?.type_stament ||
        initialData?.type_athlete ||
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

  const onValidSubmit = (data) => onSubmit(data);

  const typeIdentification = useWatch({ control, name: "type_identification" });

  const identificationRules = useMemo(() => {
    switch (typeIdentification) {
      case "ruc":
        return {
          inputMode: "numeric",
          maxLength: 13,
          placeholder: "13 dígitos",
          validate: (value) => {
            const v = (value ?? "").toString().trim();
            if (!/^\d{13}$/.test(v)) return "El RUC debe tener 13 dígitos";
            return true;
          },
        };
      case "passport":
        return {
          inputMode: "text",
          maxLength: 15,
          placeholder: "6–15 caracteres",
          validate: (value) => {
            const v = (value ?? "").toString().trim();
            if (v.length < 6 || v.length > 15) return "6-15 caracteres";
            if (!/^[A-Za-z0-9]+$/.test(v)) return "Solo alfanuméricos";
            return true;
          },
        };
      default:
        return {
          inputMode: "numeric",
          maxLength: 10,
          placeholder: "10 dígitos",
          validate: (value) => {
            const v = (value ?? "").toString().trim();
            if (!/^\d{10}$/.test(v)) return "La cédula debe tener 10 dígitos";
            return true;
          },
        };
    }
  }, [typeIdentification]);

  // Header de sección
  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-base-300">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon size={16} className="text-primary" />
      </div>
      <h3 className="font-semibold text-base-content">{title}</h3>
    </div>
  );

  // Select field
  const SelectField = ({
    label,
    options,
    error: fieldError,
    required = false,
    ...rest
  }) => (
    <div className="form-control w-full">
      <label className="label py-1">
        <span className="label-text font-medium text-base-content">
          {label} {required && <span className="text-error">*</span>}
        </span>
      </label>
      <select
        className={`select select-bordered w-full bg-white border-2 ${
          fieldError ? "border-error" : "border-base-300 focus:border-primary"
        }`}
        disabled={loading}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {fieldError && (
        <label className="label py-0">
          <span className="label-text-alt text-error">{fieldError}</span>
        </label>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      className="space-y-5"
      noValidate
    >
      {/* Error */}
      {error && (
        <div className="alert alert-error py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-5 w-5"
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

      {/* DATOS PERSONALES */}
      <section className="bg-white rounded-xl p-5 border-2 border-base-300 shadow-sm">
        <SectionHeader icon={User} title="Datos Personales" />
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Nombres"
            type="text"
            placeholder="Ej: Juan Carlos"
            error={errors.first_name?.message}
            disabled={loading}
            required
            {...register("first_name", {
              required: "Requerido",
              minLength: { value: 3, message: "Mín. 3 caracteres" },
            })}
          />
          <Input
            label="Apellidos"
            type="text"
            placeholder="Ej: Pérez García"
            error={errors.last_name?.message}
            disabled={loading}
            required
            {...register("last_name", {
              required: "Requerido",
              minLength: { value: 3, message: "Mín. 3 caracteres" },
            })}
          />
          <Input
            label="Fecha de nacimiento"
            type="date"
            error={errors.birth_date?.message}
            disabled={loading}
            required
            {...register("birth_date", { required: "Requerido" })}
          />
          <SelectField
            label="Sexo"
            options={GENDER_OPTIONS}
            error={errors.sex?.message}
            required
            {...register("sex", { required: "Requerido" })}
          />
          <SelectField
            label="Tipo de documento"
            options={TYPE_IDENTIFICATION_OPTIONS}
            error={errors.type_identification?.message}
            required
            {...register("type_identification", { required: "Requerido" })}
          />
          <Input
            label="Nº Documento"
            type="text"
            placeholder={identificationRules.placeholder}
            error={errors.dni?.message}
            disabled={loading}
            required
            inputMode={identificationRules.inputMode}
            maxLength={identificationRules.maxLength}
            {...register("dni", {
              required: "Requerido",
              validate: identificationRules.validate,
            })}
          />
        </div>
      </section>

      {/* CONTACTO + DATOS FÍSICOS - En una fila */}
      <div className="grid grid-cols-2 gap-5">
        {/* Contacto */}
        {!isMenor && (
          <section className="bg-white rounded-xl p-5 border-2 border-base-300 shadow-sm">
            <SectionHeader icon={Phone} title="Contacto" />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Teléfono"
                type="text"
                placeholder="0987654321"
                error={errors.phone?.message}
                disabled={loading}
                inputMode="numeric"
                maxLength={10}
                {...register("phone")}
              />
              <SelectField
                label="Estamento"
                options={TYPE_STAMENT_OPTIONS}
                error={errors.type_stament?.message}
                required
                {...register("type_stament", { required: "Requerido" })}
              />
              <div className="col-span-2">
                <Input
                  label="Dirección"
                  type="text"
                  placeholder="Av. Principal #123"
                  error={errors.direction?.message}
                  disabled={loading}
                  {...register("direction")}
                />
              </div>
            </div>
          </section>
        )}

        {/* Datos Físicos */}
        <section
          className={`bg-white rounded-xl p-5 border-2 border-base-300 shadow-sm ${
            isMenor ? "col-span-2" : ""
          }`}
        >
          <SectionHeader icon={Activity} title="Datos Físicos (Opcional)" />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Altura (metros)"
              type="text"
              placeholder="Ej: 1.75"
              error={errors.height?.message}
              disabled={loading}
              {...register("height")}
            />
            <Input
              label="Peso (kg)"
              type="text"
              placeholder="Ej: 70"
              error={errors.weight?.message}
              disabled={loading}
              {...register("weight")}
            />
          </div>
        </section>
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-3 pt-2">
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
          className="gap-2 shadow-lg"
        >
          <Save size={18} />
          {initialData ? "Guardar cambios" : "Registrar deportista"}
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
