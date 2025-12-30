/**
 * YoyoTestForm Component
 *
 * Formulario para crear tests Yoyo
 */

import React from "react";
import { useForm } from "react-hook-form";
import { Plus, Loader } from "lucide-react";

const YoyoTestForm = ({ evaluationId, mutation, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      athlete_id: "",
      shuttle_count: "",
      final_level: "",
      failures: 0,
      observations: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await mutation.mutateAsync({
        ...formData,
        evaluation_id: parseInt(evaluationId),
        athlete_id: parseInt(formData.athlete_id),
        shuttle_count: parseInt(formData.shuttle_count),
        failures: parseInt(formData.failures),
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

        {/* Lanzaderas */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Número de Lanzaderas *
          </label>
          <input
            type="number"
            placeholder="Ej: 47"
            {...register("shuttle_count", {
              required: "Número de lanzaderas requerido",
              min: { value: 1, message: "Debe ser mayor a 0" },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.shuttle_count && (
            <p className="text-red-600 text-sm mt-1">
              {errors.shuttle_count.message}
            </p>
          )}
        </div>

        {/* Nivel final */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nivel Final *
          </label>
          <input
            type="text"
            placeholder="Ej: 18.2"
            {...register("final_level", {
              required: "El nivel final es requerido",
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.final_level && (
            <p className="text-red-600 text-sm mt-1">
              {errors.final_level.message}
            </p>
          )}
        </div>

        {/* Fallos */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fallos (Opcional)
          </label>
          <input
            type="number"
            min="0"
            placeholder="Ej: 2"
            {...register("failures")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Observaciones (Opcional)
          </label>
          <textarea
            placeholder="Notas sobre el rendimiento..."
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
                Crear Test Yoyo
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default YoyoTestForm;
