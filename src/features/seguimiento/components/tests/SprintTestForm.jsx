/**
 * SprintTestForm Component
 *
 * Formulario para crear tests de velocidad (sprint)
 */

import React from "react";
import { useForm } from "react-hook-form";
import { Plus, Loader } from "lucide-react";

const SprintTestForm = ({ evaluationId, mutation, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      athlete_id: "",
      distance_meters: 30,
      time_0_10_s: "",
      time_0_30_s: "",
      observations: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await mutation.mutateAsync({
        ...formData,
        evaluation_id: parseInt(evaluationId),
        athlete_id: parseInt(formData.athlete_id),
        distance_meters: parseFloat(formData.distance_meters),
        time_0_10_s: parseFloat(formData.time_0_10_s),
        time_0_30_s: parseFloat(formData.time_0_30_s),
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

        {/* Distancia */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Distancia (metros) *
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Ej: 30"
            {...register("distance_meters", {
              required: "La distancia es requerida",
              min: { value: 0.01, message: "Debe ser mayor a 0" },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.distance_meters && (
            <p className="text-red-600 text-sm mt-1">
              {errors.distance_meters.message}
            </p>
          )}
        </div>

        {/* Tiempos */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiempo 0-10m (seg) *
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Ej: 1.85"
              {...register("time_0_10_s", {
                required: "El tiempo es requerido",
                min: { value: 0.01, message: "Debe ser mayor a 0" },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.time_0_10_s && (
              <p className="text-red-600 text-sm mt-1">
                {errors.time_0_10_s.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiempo 0-30m (seg) *
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Ej: 3.95"
              {...register("time_0_30_s", {
                required: "El tiempo es requerido",
                min: { value: 0.01, message: "Debe ser mayor a 0" },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.time_0_30_s && (
              <p className="text-red-600 text-sm mt-1">
                {errors.time_0_30_s.message}
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
                Crear Test de Velocidad
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SprintTestForm;
