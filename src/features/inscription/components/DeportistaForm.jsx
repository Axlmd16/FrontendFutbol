import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import PropTypes from "prop-types";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import {
  GENDER_OPTIONS,
  SPORT_CATEGORIES,
  VALIDATION,
  TYPE_IDENTIFICATION_OPTIONS,
  TYPE_STAMENT_OPTIONS,
} from "@/app/config/constants";

/**
 * DeportistaForm - Formulario de deportista
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
  // ESTADO Y CONFIGURACIÓNq
  // ==============================================

  const defaultTypeId = TYPE_IDENTIFICATION_OPTIONS?.[0]?.value ?? "dni";
  const defaultTypeStament = TYPE_STAMENT_OPTIONS?.[0]?.value ?? "estudiante";
  const defaultGender = GENDER_OPTIONS?.[0]?.value ?? "OTHER";

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

  const normalizedGender = useMemo(() => {
    const raw = (initialData?.gender ?? "").toString().trim();
    const upper = raw.toUpperCase();
    if (upper === "MASCULINO") return "MALE";
    if (upper === "FEMENINO") return "FEMALE";
    if (upper === "OTRO") return "OTHER";

    const lower = raw.toLowerCase();
    if (["male", "female", "other"].includes(lower)) return lower;

    return "";
  }, [initialData?.gender]);

  const defaultValues = useMemo(
    () => ({
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      birth_date: initialData?.birth_date || "",
      gender: normalizedGender || initialData?.gender || defaultGender,
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
    [initialData]
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
    // Valores esperados en el frontend: dni | ruc | passport
    switch (typeIdentification) {
      case "ruc":
        return {
          label: "RUC",
          min: 13,
          max: 13,
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
          min: 6,
          max: 15,
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
          min: 10,
          max: 10,
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
  // RENDER
  // ==============================================

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      className="space-y-6"
      noValidate
    >
      {/* Error del servidor */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Grid de campos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombres */}
        <Input
          label="Nombres"
          type="text"
          name="first_name"
          placeholder="Juan Pérez"
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
          placeholder="Juan Pérez"
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
          placeholder="dd/mm/yyyy"
          error={errors.birth_date?.message}
          disabled={loading}
          required
          {...register("birth_date", {
            required: "La fecha de nacimiento es requerida",
          })}
        />

        {/* Genero */}
        <div>
          <label className="block text-sm font-medium text-gray-700 ">
            Genero <span className="text-red-500">*</span>
          </label>
          <select
            className="select select-bordered w-full bg-white"
            {...register("gender", {
              required: "El genero es requerido",
            })}
          >
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dirección (Opcional) - Solo si NO es menor */}
        {!isMenor && (
          <Input
            label="Dirección"
            type="text"
            name="direction"
            placeholder="Av. Siempre Viva 123"
            error={errors.direction?.message}
            disabled={loading}
            {...register("direction")}
          />
        )}

        {/* Tipo de identificacion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 ">
            Tipo de identificación <span className="text-red-500">*</span>
          </label>
          <select
            {...register("type_identification", {
              required: "Selecciona un tipo de identificación",
            })}
            disabled={loading}
            className="select select-bordered w-full bg-white"
          >
            {TYPE_IDENTIFICATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.type_identification?.message ? (
            <p className="mt-1 text-sm text-red-600">
              {errors.type_identification.message}
            </p>
          ) : null}
        </div>

        {/* Dni (Obligatorio) */}
        <Input
          label="Número de identificación"
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

        {/* Teléfono (Opcional) - Solo si NO es menor */}
        {!isMenor && (
          <Input
            label="Teléfono"
            type="text"
            name="phone"
            placeholder="10 dígitos"
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
        )}

        {/* Tipo de estamento - Solo si NO es menor */}
        {!isMenor && (
          <div>
            <label className="block text-sm font-medium text-gray-700 ">
              Estamento <span className="text-red-500">*</span>
            </label>
            <select
              {...register("type_stament", {
                required: !isMenor ? "Selecciona un estamento" : false,
              })}
              disabled={loading}
              className="select select-bordered w-full bg-white"
            >
              {TYPE_STAMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.type_stament?.message ? (
              <p className="mt-1 text-sm text-red-600">
                {errors.type_stament.message}
              </p>
            ) : null}
          </div>
        )}

        {/* Altura (Opcional) */}
        <Input
          label="Altura (m)"
          type="text"
          name="height"
          placeholder="1.75"
          error={errors.height?.message}
          disabled={loading}
          {...register("height")}
        />

        {/* Peso (Opcional) */}
        <Input
          label="Peso (kg)"
          type="text"
          name="weight"
          placeholder="70"
          error={errors.weight?.message}
          disabled={loading}
          {...register("weight")}
        />
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
