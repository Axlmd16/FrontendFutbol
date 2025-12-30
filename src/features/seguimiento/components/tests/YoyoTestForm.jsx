/**
 * YoyoTestForm Component
 *
 * Formulario para crear tests Yoyo
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Loader } from "lucide-react";
import AthletesSelectionList from "./AthletesSelectionList";

const YoyoTestForm = ({ evaluationId, mutation, onSuccess }) => {
  const [selectedAthletes, setSelectedAthletes] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      shuttle_count: "",
      final_level: "",
      failures: 0,
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
          shuttle_count: parseInt(formData.shuttle_count),
          failures: parseInt(formData.failures),
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
          Datos del Test Yoyo
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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
    </div>
  );
};

export default YoyoTestForm;
