/**
 * EvaluationForm Component
 *
 * Formulario reutilizable para crear y editar evaluaciones
 */

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateEvaluation,
  useUpdateEvaluation,
  useEvaluationById,
} from "../hooks/useEvaluations";
import { getCurrentUser } from "@/shared/utils/authUtils";

const EvaluationForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: "",
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      location: "",
      observations: "",
    },
  });

  const currentUser = getCurrentUser();
  const createEvaluation = useCreateEvaluation();
  const updateEvaluation = useUpdateEvaluation();
  const { data: evaluationData, isLoading: isLoadingData } = useEvaluationById(
    id
  );

  // Cargar datos si es edición
  useEffect(() => {
    if (isEdit && evaluationData?.data) {
      const evaluation = evaluationData.data;
      setValue("name", evaluation.name);
      setValue("date", evaluation.date.split("T")[0]);
      setValue("time", evaluation.time);
      setValue("location", evaluation.location || "");
      setValue("observations", evaluation.observations || "");
    }
  }, [evaluationData, isEdit, setValue]);

  const onSubmit = async (formData) => {
    // Validar que la fecha no sea anterior a hoy
    const today = new Date().toISOString().split("T")[0];
    if (formData.date < today) {
      toast.error("La fecha no puede ser anterior a hoy");
      return;
    }

    // Normalizar fecha sin desplazar por zona horaria
    const normalizeDate = (value) => {
      if (!value) return value;
      // Formato nativo input date: YYYY-MM-DD
      if (value.includes("-")) return value.slice(0, 10);
      // Formato local MM/DD/YYYY
      if (value.includes("/")) {
        const [mm, dd, yyyy] = value.split("/");
        if (yyyy && mm && dd) {
          return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
        }
      }
      return value;
    };

    // Combinar fecha + hora en un datetime ISO para que el backend compare con hora correcta
    const selectedDate = normalizeDate(formData.date);
    const timeHHMM = (formData.time || "00:00").slice(0, 5);
    const dateTimeIso = `${selectedDate}T${timeHHMM}:00`;

    const payload = {
      ...formData,
      date: dateTimeIso,
    };

    // Debug: ver payload que se envía
    // eslint-disable-next-line no-console
    console.log("Payload evaluación:", payload);

    // Asegurar que el user_id se envía siempre que exista
    if (!isEdit) {
      payload.user_id = currentUser?.id;
    }

    try {
      if (isEdit) {
        await updateEvaluation.mutateAsync({
          id,
          data: payload,
        });
      } else {
        const result = await createEvaluation.mutateAsync({
          ...payload,
        });
        // Redirigir a la evaluación creada para agregar tests
        setTimeout(() => {
          navigate(
            `/seguimiento/evaluations/${result.data.id}/add-tests`
          );
        }, 1500);
        return;
      }

      // Redirigir a lista si es edición
      setTimeout(() => {
        navigate("/seguimiento/evaluations");
      }, 1500);
    } catch (error) {
      console.error("Error en formulario:", error);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (isEdit && isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/seguimiento/evaluations")}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? "Editar Evaluación" : "Nueva Evaluación"}
        </h1>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-lg p-8 space-y-6"
      >
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre de la Evaluación *
          </label>
          <input
            type="text"
            placeholder="Ej: Evaluación Física Pre-Temporada"
            {...register("name", {
              required: "El nombre es requerido",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Fecha */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha *
            </label>
            <input
              type="date"
              {...register("date", {
                required: "La fecha es requerida",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && (
              <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Hora */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hora *
            </label>
            <input
              type="time"
              {...register("time", {
                required: "La hora es requerida",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.time && (
              <p className="text-red-600 text-sm mt-1">{errors.time.message}</p>
            )}
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ubicación (Opcional)
          </label>
          <input
            type="text"
            placeholder="Ej: Cancha Principal"
            {...register("location")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Observaciones (Opcional)
          </label>
          <textarea
            placeholder="Notas adicionales sobre la evaluación..."
            rows="4"
            {...register("observations")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={createEvaluation.isPending || updateEvaluation.isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
          >
            {createEvaluation.isPending || updateEvaluation.isPending
              ? "Guardando..."
              : isEdit
              ? "Actualizar Evaluación"
              : "Crear Evaluación"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/seguimiento/evaluations")}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg transition"
          >
            Cancelar
          </button>
        </div>

        {!isEdit && (
          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            ℹ️ Después de crear la evaluación, podrás agregar tests de velocidad,
            resistencia, Yoyo y evaluaciones técnicas.
          </p>
        )}
      </form>
    </div>
  );
};

export default EvaluationForm;
