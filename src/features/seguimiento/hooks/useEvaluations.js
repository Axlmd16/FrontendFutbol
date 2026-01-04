/**
 * Hook useEvaluations
 *
 * Gestiona el estado y operaciones de evaluaciones
 * usando React Query para caché y sincronización
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import evaluationsApi from "../services/evaluations.api";
import { toast } from "sonner";

export const useEvaluations = (params = { page: 1, limit: 20 }) => {
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
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
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

export const useTestsByEvaluation = (evaluationId) => {
  return useQuery({
    queryKey: ["tests-by-evaluation", evaluationId],
    queryFn: () => evaluationsApi.getTestsByEvaluation(evaluationId),
    enabled: !!evaluationId,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
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
        error.response?.data?.detail || 
        error.message || 
        "Error al crear evaluación";
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
        error.response?.data?.detail || 
        error.message || 
        "Error al actualizar evaluación";
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
        error.response?.data?.detail || 
        error.message || 
        "Error al eliminar evaluación";
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
        refetchType: 'active',
      });
      queryClient.invalidateQueries({
        queryKey: ["tests-by-evaluation", variables.evaluation_id],
        refetchType: 'active',
      });
      toast.success("Test de velocidad creado exitosamente");
      return data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 
        error.message || 
        "Error al crear test de velocidad";
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
        refetchType: 'active',
      });
      queryClient.invalidateQueries({
        queryKey: ["tests-by-evaluation", variables.evaluation_id],
        refetchType: 'active',
      });
      toast.success("Test Yoyo creado exitosamente");
      return data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 
        error.message || 
        "Error al crear test Yoyo";
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
        refetchType: 'active',
      });
      queryClient.invalidateQueries({
        queryKey: ["tests-by-evaluation", variables.evaluation_id],
        refetchType: 'active',
      });
      toast.success("Test de resistencia creado exitosamente");
      return data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 
        error.message || 
        "Error al crear test de resistencia";
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
        refetchType: 'active',
      });
      queryClient.invalidateQueries({
        queryKey: ["tests-by-evaluation", variables.evaluation_id],
        refetchType: 'active',
      });
      toast.success("Evaluación técnica creada exitosamente");
      return data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 
        error.message || 
        "Error al crear evaluación técnica";
      toast.error(message);
    },
  });
};

// ===============================================
// Hooks para Actualizar Tests
// ===============================================

export const useUpdateSprintTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ testId, data }) => evaluationsApi.updateSprintTest(testId, data),
    onSuccess: (data, variables) => {
      const evaluationId = data.data?.evaluation_id;
      if (evaluationId) {
        queryClient.invalidateQueries({
          queryKey: ["tests-by-evaluation", evaluationId],
          refetchType: 'active',
        });
      }
      toast.success("Test de velocidad actualizado exitosamente");
      return data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 
        error.message || 
        "Error al actualizar test de velocidad";
      toast.error(message);
    },
  });
};

export const useUpdateYoyoTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ testId, data }) => evaluationsApi.updateYoyoTest(testId, data),
    onSuccess: (data, variables) => {
      const evaluationId = data.data?.evaluation_id;
      if (evaluationId) {
        queryClient.invalidateQueries({
          queryKey: ["tests-by-evaluation", evaluationId],
          refetchType: 'active',
        });
      }
      toast.success("Test Yoyo actualizado exitosamente");
      return data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 
        error.message || 
        "Error al actualizar test Yoyo";
      toast.error(message);
    },
  });
};

export const useUpdateEnduranceTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ testId, data }) => evaluationsApi.updateEnduranceTest(testId, data),
    onSuccess: (data, variables) => {
      const evaluationId = data.data?.evaluation_id;
      if (evaluationId) {
        queryClient.invalidateQueries({
          queryKey: ["tests-by-evaluation", evaluationId],
          refetchType: 'active',
        });
      }
      toast.success("Test de resistencia actualizado exitosamente");
      return data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 
        error.message || 
        "Error al actualizar test de resistencia";
      toast.error(message);
    },
  });
};

export const useUpdateTechnicalAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ testId, data }) => evaluationsApi.updateTechnicalAssessment(testId, data),
    onSuccess: (data, variables) => {
      const evaluationId = data.data?.evaluation_id;
      if (evaluationId) {
        queryClient.invalidateQueries({
          queryKey: ["tests-by-evaluation", evaluationId],
          refetchType: 'active',
        });
      }
      toast.success("Evaluación técnica actualizada exitosamente");
      return data;
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 
        error.message || 
        "Error al actualizar evaluación técnica";
      toast.error(message);
    },
  });
};

// ===============================================
// Hooks para Eliminar Tests
// ===============================================

export const useDeleteSprintTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluationsApi.deleteSprintTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests-by-evaluation"] });
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      toast.success("Test de velocidad eliminado exitosamente");
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 
        error.message || 
        "Error al eliminar test de velocidad";
      toast.error(message);
    },
  });
};

export const useDeleteYoyoTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluationsApi.deleteYoyoTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests-by-evaluation"] });
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      toast.success("Test Yoyo eliminado exitosamente");
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 
        error.message || 
        "Error al eliminar test Yoyo";
      toast.error(message);
    },
  });
};

export const useDeleteEnduranceTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluationsApi.deleteEnduranceTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests-by-evaluation"] });
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      toast.success("Test de resistencia eliminado exitosamente");
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 
        error.message || 
        "Error al eliminar test de resistencia";
      toast.error(message);
    },
  });
};

export const useDeleteTechnicalAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluationsApi.deleteTechnicalAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests-by-evaluation"] });
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      toast.success("Evaluación técnica eliminada exitosamente");
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 
        error.message || 
        "Error al eliminar evaluación técnica";
      toast.error(message);
    },
  });
};
