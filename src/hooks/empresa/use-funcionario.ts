// src/hooks/empresa/use-funcionario.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FuncionarioFormData } from "@/src/schemas/empresa/afilias/funcionario-schema";
import Cookies from "js-cookie";
import { serviceFuncioario } from "@/src/services/equipa/funcionario-service";

export const useFuncionarioMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: FuncionarioFormData) =>
      serviceFuncioario.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast.success("Funcionário criado com sucesso!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Erro ao criar funcionário";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<FuncionarioFormData>;
    }) => serviceFuncioario.update({ data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast.success("Funcionário actualizado com sucesso!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Erro ao actualizar funcionário";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => serviceFuncioario.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast.success("Funcionário removido com sucesso!");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (data: { id: string; ativo: boolean }) =>
      serviceFuncioario.toggleStatus(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast.success(
        variables.ativo
          ? "Funcionário activado com sucesso!"
          : "Funcionário desactivado com sucesso!",
      );
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    toggleStatusMutation,
  };
};

// Hook para listar funcionários
export const useFuncionarios = (filters?: {
  filial?: string;
  papel?: string;
  ativo?: boolean;
}) => {
  return useQuery({
    queryKey: ["funcionarios", filters],
    queryFn: () => serviceFuncioario.get(filters),
  });
};

// Hook para buscar funcionário por ID
export const useFuncionario = (id: string) => {
  return useQuery({
    queryKey: ["funcionarios", id],
    queryFn: () => serviceFuncioario.getById(id),
    enabled: !!id,
  });
};

export const useFuncionarioAtual = () => {
  const token = typeof window !== "undefined" ? Cookies.get("token") : null;
  return useQuery({
    queryKey: ["funcionario", "me"],
    queryFn: () => serviceFuncioario.getCurrentUser(),
    enabled: !!token,
    staleTime: 0,
  });
};
