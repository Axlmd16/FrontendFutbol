/**
 * TechnicalAssessmentForm Component
 *
 * Formulario para crear y editar evaluaciones técnicas
 */

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Loader, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AthletesSelectionList from "./AthletesSelectionList";

const SCALE_OPTIONS = [
  { value: "Poor", label: "Pobre" },
  { value: "Average", label: "Regular" },
  { value: "Good", label: "Bueno" },
  { value: "Excellent", label: "Excelente" },
];

const TechnicalAssessmentForm = ({
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
      ball_control: isEdit ? testData?.ball_control : "Average",
      short_pass: isEdit ? testData?.short_pass : "Average",
      long_pass: isEdit ? testData?.long_pass : "Average",
      shooting: isEdit ? testData?.shooting : "Average",
      dribbling: isEdit ? testData?.dribbling : "Average",
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
      setValue("ball_control", testData.ball_control || "Average");
      setValue("short_pass", testData.short_pass || "Average");
      setValue("long_pass", testData.long_pass || "Average");
      setValue("shooting", testData.shooting || "Average");
      setValue("dribbling", testData.dribbling || "Average");
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
            ball_control: formData.ball_control,
            short_pass: formData.short_pass,
            long_pass: formData.long_pass,
            shooting: formData.shooting,
            dribbling: formData.dribbling,
            observations: formData.observations,
          },
        });
      } else {
        // Crear test para un único atleta
        await mutation.mutateAsync({
          ...formData,
          evaluation_id: parseInt(evaluationId),
          athlete_id: selectedAthlete.id,
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
            Editar Evaluación Técnica
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
          {isEdit ? "Actualizar Evaluación Técnica" : "Datos de la Evaluación Técnica"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Grid de evaluaciones técnicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Control de Balón */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Control de Balón
              </label>
              <select
                {...register("ball_control")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SCALE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Pase Corto */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pase Corto
              </label>
              <select
                {...register("short_pass")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SCALE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Pase Largo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pase Largo
              </label>
              <select
                {...register("long_pass")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SCALE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tiro */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tiro
              </label>
              <select
                {...register("shooting")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SCALE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dribling */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dribling
              </label>
              <select
                {...register("dribbling")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SCALE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Observaciones (Opcional)
            </label>
            <textarea
              placeholder="Notas sobre el desempeño técnico..."
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
                  {isEdit ? "Actualizar Evaluación" : "Crear Evaluación Técnica"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TechnicalAssessmentForm;
