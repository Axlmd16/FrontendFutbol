/**
 * YoyoTestForm Component
 *
 * Formulario para crear y editar tests Yoyo
 */

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Loader, ArrowLeft } from "lucide-react";
import AthletesSelectionList from "./AthletesSelectionList";

const YoyoTestForm = ({
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
      shuttle_count: isEdit ? testData?.shuttle_count : "",
      final_level: isEdit ? testData?.final_level : "",
      failures: isEdit ? testData?.failures : 0,
      observations: isEdit ? testData?.observations : "",
    },
  });

  // Cargar datos del test si es edición
  useEffect(() => {
    if (isEdit && testData) {
      setSelectedAthletes([testData.athlete_id]);
      setValue("shuttle_count", testData.shuttle_count);
      setValue("final_level", testData.final_level);
      setValue("failures", testData.failures);
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
            shuttle_count: parseInt(formData.shuttle_count),
            final_level: formData.final_level,
            failures: parseInt(formData.failures),
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
            shuttle_count: parseInt(formData.shuttle_count),
            failures: parseInt(formData.failures),
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
            Editar Test Yoyo
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
          {isEdit ? "Actualizar Test Yoyo" : "Datos del Test Yoyo"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Número de Shuttles */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Número de Shuttles Completados *
            </label>
            <input
              type="number"
              placeholder="Ej: 47"
              {...register("shuttle_count", {
                required: "El número de shuttles es requerido",
                min: { value: 0, message: "Debe ser mayor a 0" },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.shuttle_count && (
              <p className="text-red-600 text-sm mt-1">
                {errors.shuttle_count.message}
              </p>
            )}
          </div>

          {/* Nivel Final */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nivel Final Alcanzado *
            </label>
            <input
              type="text"
              placeholder="Ej: 16.3, 18.2"
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
              Número de Fallos *
            </label>
            <input
              type="number"
              placeholder="Ej: 2"
              {...register("failures", {
                required: "El número de fallos es requerido",
                min: { value: 0, message: "No puede ser negativo" },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.failures && (
              <p className="text-red-600 text-sm mt-1">
                {errors.failures.message}
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
                  {isEdit ? "Actualizar Test" : "Crear Test Yoyo"}
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
