import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import { ROUTES } from "@/app/config/constants";

const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitForm = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Mensaje de error del servidor */}
      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Campo de email */}
      <div>
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          disabled={loading}
          autoComplete="email"
          {...register("email", {
            required: "El email es requerido",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Ingresa un email válido",
            },
          })}
        />
      </div>

      {/* Campo de contraseña con toggle de visibilidad */}
      <div>
        <label className="block text-sm font-medium text-base-content mb-2">
          Contraseña <span className="text-error">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            disabled={loading}
            autoComplete="current-password"
            className={`input input-bordered bg-white w-full pr-12 ${
              errors.password ? "input-error" : ""
            } ${loading ? "input-disabled" : ""}`}
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: {
                value: 8,
                message: "Mínimo 8 caracteres",
              },
            })}
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors focus:outline-none z-10 pointer-events-auto"
            tabIndex={-1}
            disabled={loading}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-error text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Link de contraseña olvidada alineado a la derecha */}
      <div className="flex justify-end">
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-primary hover:text-primary/80 font-medium"
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
