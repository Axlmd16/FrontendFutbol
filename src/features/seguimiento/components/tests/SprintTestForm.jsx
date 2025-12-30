/**
 * SprintTestForm Component
 *
 * Formulario para crear tests de velocidad (sprint)
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Loader } from "lucide-react";
import AthletesSelectionList from "./AthletesSelectionList";

const SprintTestForm = ({ evaluationId, mutation, onSuccess }) => {
  const [selectedAthletes, setSelectedAthletes] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      distance_meters: 30,
      time_0_10_s: "",
      time_0_30_s: "",
      observations: "",
    },
  });

  const onSubmit = async (formData) => {
    // Validar que haya atletas seleccionados
    if (selectedAthletes.length === 0) {
      alert("Por favor selecciona al menos un atleta");
      return;
    }

    try {
      // Crear un test para cada atleta seleccionado
      for (const athleteId of selectedAthletes) {
        await mutation.mutateAsync({
          ...formData,
          evaluation_id: parseInt(evaluationId),
          athlete_id: athleteId,
          distance_meters: parseFloat(formData.distance_meters),
          time_0_10_s: parseFloat(formData.time_0_10_s),
          time_0_30_s: parseFloat(formData.time_0_30_s),
          date: new Date().toISOString(),
        });
      }
      reset();
      setSelectedAthletes([]);
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selección de atletas */}
      <AthletesSelectionList
        selectedAthleteIds={selectedAthletes}
        onSelectionChange={setSelectedAthletes}
        multiSelect={true}
        loading={mutation.isPending}
      />

      {/* Formulario de datos del test */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Datos del Test de Velocidad
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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
    </div>
  );
};

export default SprintTestForm;

