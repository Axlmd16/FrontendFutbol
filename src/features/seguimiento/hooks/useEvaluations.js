/**
 * Hook useEvaluations
 *
 * Gestiona el estado y operaciones de evaluaciones
 * usando React Query para caché y sincronización
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import evaluationsApi from "../services/evaluations.api";
import { toast } from "sonner";

export const useEvaluations = (params = { skip: 0, limit: 20 }) => {
  return useQuery({
    queryKey: ["evaluations", params],
    queryFn: () => evaluationsApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useEvaluationById = (id) => {
  return useQuery({
    queryKey: ["evaluation", id],
    queryFn: () => evaluationsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useEvaluationsByUser = (userId) => {
  return useQuery({
    queryKey: ["evaluations-by-user", userId],
    queryFn: () => evaluationsApi.getByUser(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluationsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      toast.success("Evaluación creada exitosamente");
      return data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || "Error al crear evaluación";
      toast.error(message);
    },
  });
};

export const useUpdateEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => evaluationsApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["evaluation", variables.id] });
      toast.success("Evaluación actualizada exitosamente");
      return data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || "Error al actualizar evaluación";
      toast.error(message);
    },
  });
};

export const useDeleteEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      toast.success("Evaluación eliminada exitosamente");
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || "Error al eliminar evaluación";
      toast.error(message);
    },
  });
};

// ===============================================
// Hooks para Tests
// ===============================================

export const useCreateSprintTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluationsApi.createSprintTest,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["evaluation", variables.evaluation_id],
      });
      toast.success("Test de velocidad creado exitosamente");
      return data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || "Error al crear test de velocidad";
      toast.error(message);
    },
  });
};

export const useCreateYoyoTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluationsApi.createYoyoTest,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["evaluation", variables.evaluation_id],
      });
      toast.success("Test Yoyo creado exitosamente");
      return data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || "Error al crear test Yoyo";
      toast.error(message);
    },
  });
};

export const useCreateEnduranceTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluationsApi.createEnduranceTest,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["evaluation", variables.evaluation_id],
      });
      toast.success("Test de resistencia creado exitosamente");
      return data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || "Error al crear test de resistencia";
      toast.error(message);
    },
  });
};

export const useCreateTechnicalAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluationsApi.createTechnicalAssessment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["evaluation", variables.evaluation_id],
      });
      toast.success("Evaluación técnica creada exitosamente");
      return data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || "Error al crear evaluación técnica";
      toast.error(message);
    },
  });
};
