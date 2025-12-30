/**
 * TechnicalAssessmentForm Component
 *
 * Formulario para crear evaluaciones técnicas
 */

import React from "react";
import { useForm } from "react-hook-form";
import { Plus, Loader } from "lucide-react";

const SCALE_OPTIONS = [
  { value: "MUY_BAJO", label: "Muy Bajo" },
  { value: "BAJO", label: "Bajo" },
  { value: "MEDIO", label: "Medio" },
  { value: "ALTO", label: "Alto" },
  { value: "MUY_ALTO", label: "Muy Alto" },
];

const TechnicalAssessmentForm = ({ evaluationId, mutation, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      athlete_id: "",
      ball_control: "MEDIO",
      short_pass: "MEDIO",
      long_pass: "MEDIO",
      shooting: "MEDIO",
      dribbling: "MEDIO",
      observations: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await mutation.mutateAsync({
        ...formData,
        evaluation_id: parseInt(evaluationId),
        athlete_id: parseInt(formData.athlete_id),
        date: new Date().toISOString(),
      });
      reset();
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Atleta */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Deportista ID *
          </label>
          <input
            type="number"
            placeholder="ID del deportista"
            {...register("athlete_id", {
              required: "El ID del deportista es requerido",
              min: { value: 1, message: "ID inválido" },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.athlete_id && (
            <p className="text-red-600 text-sm mt-1">
              {errors.athlete_id.message}
            </p>
          )}
        </div>

        {/* Habilidades técnicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Control de Balón */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Control de Balón *
            </label>
            <select
              {...register("ball_control", {
                required: "Selecciona una opción",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SCALE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.ball_control && (
              <p className="text-red-600 text-sm mt-1">
                {errors.ball_control.message}
              </p>
            )}
          </div>

          {/* Pase Corto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pase Corto *
            </label>
            <select
              {...register("short_pass", {
                required: "Selecciona una opción",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SCALE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.short_pass && (
              <p className="text-red-600 text-sm mt-1">
                {errors.short_pass.message}
              </p>
            )}
          </div>

          {/* Pase Largo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pase Largo *
            </label>
            <select
              {...register("long_pass", {
                required: "Selecciona una opción",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SCALE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.long_pass && (
              <p className="text-red-600 text-sm mt-1">
                {errors.long_pass.message}
              </p>
            )}
          </div>

          {/* Disparo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Disparo *
            </label>
            <select
              {...register("shooting", {
                required: "Selecciona una opción",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SCALE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.shooting && (
              <p className="text-red-600 text-sm mt-1">
                {errors.shooting.message}
              </p>
            )}
          </div>

          {/* Regate */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Regate *
            </label>
            <select
              {...register("dribbling", {
                required: "Selecciona una opción",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SCALE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.dribbling && (
              <p className="text-red-600 text-sm mt-1">
                {errors.dribbling.message}
              </p>
            )}
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Observaciones (Opcional)
          </label>
          <textarea
            placeholder="Notas sobre la evaluación técnica..."
            rows="3"
            {...register("observations")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
          >
            {mutation.isPending ? (
              <>
                <Loader size={20} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Plus size={20} />
                Crear Evaluación Técnica
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TechnicalAssessmentForm;
