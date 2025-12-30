/**
 * EnduranceTestForm Component
 *
 * Formulario para crear tests de resistencia
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Loader } from "lucide-react";
import AthletesSelectionList from "./AthletesSelectionList";

const EnduranceTestForm = ({ evaluationId, mutation, onSuccess }) => {
  const [selectedAthletes, setSelectedAthletes] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      min_duration: "",
      total_distance_m: "",
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
          min_duration: parseInt(formData.min_duration),
          total_distance_m: parseFloat(formData.total_distance_m),
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
          Datos del Test de Resistencia
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Duración */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Duración (minutos) *
          </label>
          <input
            type="number"
            placeholder="Ej: 12"
            {...register("min_duration", {
              required: "La duración es requerida",
              min: { value: 1, message: "Debe ser mayor a 0" },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.min_duration && (
            <p className="text-red-600 text-sm mt-1">
              {errors.min_duration.message}
            </p>
          )}
        </div>

        {/* Distancia */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Distancia Total (metros) *
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Ej: 2500"
            {...register("total_distance_m", {
              required: "La distancia es requerida",
              min: { value: 0.01, message: "Debe ser mayor a 0" },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.total_distance_m && (
            <p className="text-red-600 text-sm mt-1">
              {errors.total_distance_m.message}
            </p>
          )}
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
                Crear Test de Resistencia
              </>
            )}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default EnduranceTestForm;

