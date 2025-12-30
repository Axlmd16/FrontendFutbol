/**
 * SprintTestForm Component
 *
 * Formulario para crear y editar tests de velocidad (sprint)
 */

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Loader, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AthletesSelectionList from "./AthletesSelectionList";

const SprintTestForm = ({
  evaluationId,
  mutation,
  onSuccess,
  isEdit = false,
  testData = null,
  onCancel,
  selectedAthlete: selectedAthleteProp = null,
  hideAthleteSelector = false,
}) => {
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);

  const formatAthleteType = (type) => {
    const types = {
      EXTERNOS: "Escuela",
      ESTUDIANTES: "Estudiante",
      DOCENTES: "Docente",
      TRABAJADORES: "Trabajador",
      ADMINISTRATIVOS: "Admin",
    };
    return types[type] || type || "Tipo no disponible";
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      distance_meters: isEdit ? testData?.distance_meters : 30,
      time_0_10_s: isEdit ? testData?.time_0_10_s : "",
      time_0_30_s: isEdit ? testData?.time_0_30_s : "",
      observations: isEdit ? testData?.observations : "",
    },
  });

  // Cargar datos del test si es edición
  useEffect(() => {
    if (isEdit && testData) {
      setSelectedAthletes([testData.athlete_id]);
      setSelectedAthlete({
        id: testData.athlete_id,
        full_name: testData.athlete_name || `Atleta ${testData.athlete_id}`,
        dni: testData.athlete_dni,
        type_athlete: testData.athlete_type,
        height: testData.athlete_height,
        weight: testData.athlete_weight,
      });
      setValue("distance_meters", testData.distance_meters);
      setValue("time_0_10_s", testData.time_0_10_s);
      setValue("time_0_30_s", testData.time_0_30_s);
      setValue("observations", testData.observations || "");
    }
  }, [isEdit, testData, setValue]);

  // Sincronizar atleta pasado por props (flujo de creación desde AddTestsForm)
  useEffect(() => {
    if (!isEdit && selectedAthleteProp) {
      setSelectedAthletes([selectedAthleteProp.id]);
      setSelectedAthlete(selectedAthleteProp);
    }
  }, [selectedAthleteProp, isEdit]);

  const onSubmit = async (formData) => {
    // Validar que haya atletas seleccionados
    if (selectedAthletes.length === 0 || !selectedAthlete) {
      toast.error("Por favor selecciona un atleta");
      return;
    }

    try {
      if (isEdit) {
        // Editar test existente
        await mutation.mutateAsync({
          testId: testData.id,
          data: {
            athlete_id: selectedAthlete.id,
            distance_meters: parseFloat(formData.distance_meters),
            time_0_10_s: parseFloat(formData.time_0_10_s),
            time_0_30_s: parseFloat(formData.time_0_30_s),
            observations: formData.observations,
          },
        });
      } else {
        // Crear test para un único atleta
        await mutation.mutateAsync({
          ...formData,
          evaluation_id: parseInt(evaluationId),
          athlete_id: selectedAthlete.id,
          distance_meters: parseFloat(formData.distance_meters),
          time_0_10_s: parseFloat(formData.time_0_10_s),
          time_0_30_s: parseFloat(formData.time_0_30_s),
          date: new Date().toISOString(),
        });
      }
      reset();
      setSelectedAthletes([]);
      setSelectedAthlete(null);
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
            Editar Test de Velocidad
          </h1>
        </div>
      )}

      {/* Selección de atletas (solo cuando no se provee desde el flujo externo) */}
      {!hideAthleteSelector && (
        <AthletesSelectionList
          selectedAthleteIds={selectedAthletes}
          onSelectionChange={setSelectedAthletes}
          multiSelect={false}
          loading={mutation.isPending}
          disabled={isEdit}
          onSelectedAthleteChange={setSelectedAthlete}
        />
      )}

      {/* Datos del atleta seleccionado */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Atleta seleccionado</h4>
        {selectedAthlete ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-900">{selectedAthlete.full_name || "Nombre no disponible"}</p>
              <p className="text-sm text-gray-600">DNI: {selectedAthlete.dni || "No disponible"}</p>
              <p className="text-sm text-gray-600">Tipo: {formatAthleteType(selectedAthlete.type_athlete)}</p>
              <p className="text-sm text-gray-600">Altura: {selectedAthlete.height ? `${selectedAthlete.height} cm` : "No disponible"}</p>
              <p className="text-sm text-gray-600">Peso: {selectedAthlete.weight ? `${selectedAthlete.weight} kg` : "No disponible"}</p>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full">
              1 seleccionado
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Selecciona un atleta para continuar.</p>
        )}
      </div>

      {/* Formulario de datos del test */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          {isEdit ? "Actualizar Test de Velocidad" : "Datos del Test de Velocidad"}
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
                  {isEdit ? "Actualizar Test" : "Crear Test de Velocidad"}
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
