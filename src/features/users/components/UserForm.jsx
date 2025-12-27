import { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import { ROLE_OPTIONS } from "@/app/config/roles";
import { VALIDATION } from "@/app/config/constants";
import { useForm, useWatch } from "react-hook-form";
import { TYPE_IDENTIFICATION_OPTIONS } from "../../../app/config/constants";
import { TYPE_STAMENT_OPTIONS } from "../../../app/config/constants";

const UserForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  isEdit = false,
}) => {
  const defaultRole = ROLE_OPTIONS?.[0]?.value ?? "Administrador";
  const defaultTypeId = TYPE_IDENTIFICATION_OPTIONS?.[0]?.value ?? "dni";
  const defaultTypeStament = TYPE_STAMENT_OPTIONS?.[0]?.value ?? "estudiante";

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

  const defaultValues = useMemo(
    () => ({
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      email: initialData?.email || "",
      dni: initialData?.dni || "",
      password: "",
      passwordConfirmation: "",
      role: initialData?.role || defaultRole,
      type_identification:
        normalizedTypeIdentification ||
        initialData?.type_identification ||
        defaultTypeId,
      type_stament:
        normalizedTypeStament ||
        initialData?.type_stament ||
        defaultTypeStament,
      direction: initialData?.direction || "",
      phone: initialData?.phone || "",
    }),
    [
      defaultRole,
      defaultTypeId,
      defaultTypeStament,
      initialData,
      normalizedTypeIdentification,
      normalizedTypeStament,
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

  const password = useWatch({ control, name: "password" });
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
            if (!/^\d{13}$/.test(v)) return "El RUC debe tener exactamente 13 dígitos";
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
            if (!/^\d{10}$/.test(v)) return "La cédula debe tener exactamente 10 dígitos";
            return true;
          },
        };
    }
  }, [typeIdentification]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onValidSubmit = (data) => {
    const dataToSubmit = { ...data };

    // Campo solo de UI (confirmación), nunca se envía al backend
    delete dataToSubmit.passwordConfirmation;

    // En edición, omitir contraseña si está vacía
    if (isEdit && !dataToSubmit.password) {
      delete dataToSubmit.password;
    }

    onSubmit(dataToSubmit);
  };

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

        {/* Email */}
        <Input
          label="Correo electrónico"
          type="email"
          name="email"
          placeholder="juan@email.com"
          error={errors.email?.message}
          disabled={loading}
          required
          {...register("email", {
            required: "El email es requerido",
            pattern: {
              value: VALIDATION.EMAIL_PATTERN,
              message: "Ingresa un email válido",
            },
          })}
        />

        {/* Dirección (Opcional) */}
        <Input
          label="Dirección"
          type="text"
          name="direction"
          placeholder="Av. Siempre Viva 123"
          error={errors.direction?.message}
          disabled={loading}
          {...register("direction")}
        />

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

        {/* Teléfono (Opcional) */}
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
              if (!/^\d{10}$/.test(v)) return "El teléfono debe tener exactamente 10 dígitos";
              return true;
            },
          })}
        />

        {/* Tipo de estamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 ">
            Estamento <span className="text-red-500">*</span>
          </label>
          <select
            {...register("type_stament", {
              required: "Selecciona un estamento",
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

        {/* Rol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 ">
            Rol <span className="text-red-500">*</span>
          </label>
          <select
            {...register("role", { required: "Selecciona un rol" })}
            disabled={loading}
            className="select select-bordered w-full bg-white"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.role?.message ? (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          ) : null}
        </div>

        {/* Contraseña */}
        <Input
          label={isEdit ? "Nueva contraseña (opcional)" : "Contraseña"}
          type="password"
          name="password"
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={loading}
          required={!isEdit}
          {...register("password", {
            required: isEdit ? false : "La contraseña es requerida",
            validate: (value) => {
              if (!value) return true;
              return (
                value.length >= VALIDATION.PASSWORD_MIN_LENGTH ||
                `Mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`
              );
            },
          })}
        />

        {/* Confirmar contraseña */}
        <Input
          label="Confirmar contraseña"
          type="password"
          name="passwordConfirmation"
          placeholder="••••••••"
          error={errors.passwordConfirmation?.message}
          disabled={loading}
          required={!isEdit && !!password}
          {...register("passwordConfirmation", {
            validate: (value) => {
              if (!password && !value) return true;
              if (password && !value) return "Confirma la contraseña";
              if (value !== password) return "Las contraseñas no coinciden";
              return true;
            },
          })}
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
          {isEdit ? "Guardar cambios" : "Crear usuario"}
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
