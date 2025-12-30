/**
 * EnduranceTestForm Component
 *
 * Formulario para crear y editar tests de resistencia
 */

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Loader, ArrowLeft } from "lucide-react";
import AthletesSelectionList from "./AthletesSelectionList";

const EnduranceTestForm = ({
  evaluationId,
  mutation,
  onSuccess,
  isEdit = false,
  testData = null,
  onCancel,
}) => {
  const [selectedAthletes, setSelectedAthletes] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      min_duration: isEdit ? testData?.min_duration : "",
      total_distance_m: isEdit ? testData?.total_distance_m : "",
      observations: isEdit ? testData?.observations : "",
    },
  });

  // Cargar datos del test si es edición
  useEffect(() => {
    if (isEdit && testData) {
      setSelectedAthletes([testData.athlete_id]);
      setValue("min_duration", testData.min_duration);
      setValue("total_distance_m", testData.total_distance_m);
      setValue("observations", testData.observations || "");
    }
  }, [isEdit, testData, setValue]);

  const onSubmit = async (formData) => {
    // Validar que haya atletas seleccionados
    if (selectedAthletes.length === 0) {
      alert("Por favor selecciona al menos un atleta");
      return;
    }

    try {
      if (isEdit) {
        // Editar test existente
        await mutation.mutateAsync({
          testId: testData.id,
          data: {
            athlete_id: selectedAthletes[0],
            min_duration: parseInt(formData.min_duration),
            total_distance_m: parseFloat(formData.total_distance_m),
            observations: formData.observations,
          },
        });
      } else {
        // Crear nuevos tests para cada atleta
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
      {/* Encabezado si es edición */}
      {isEdit && (
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Test de Resistencia
          </h1>
        </div>
      )}

      {/* Selección de atletas */}
      <AthletesSelectionList
        selectedAthleteIds={selectedAthletes}
        onSelectionChange={setSelectedAthletes}
        multiSelect={!isEdit}
        loading={mutation.isPending}
        disabled={isEdit}
      />

      {/* Formulario de datos del test */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          {isEdit ? "Actualizar Test de Resistencia" : "Datos del Test de Resistencia"}
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

          {/* Distancia Total */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Distancia Total (metros) *
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Ej: 2500"
              {...register("total_distance_m", {
                required: "La distancia total es requerida",
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
            {isEdit && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            )}
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
                  {isEdit ? "Actualizar Test" : "Crear Test de Resistencia"}
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
