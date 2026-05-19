// src/hooks/empresa/use-funcionario.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { toast } from "sonner";
import { FuncionarioFormData } from "@/src/schemas/empresa/afilias/funcionario-schema";
import { z } from "zod";

// Schema para resposta da API
const FuncionarioResponseSchema = z.object({
  id: z.uuid(),
  nome_completo: z.string(),
  email: z.email(),
  bi: z.string(),
  cargo: z.string(),
  papel: z.string(),
  ativo: z.boolean(),
  telemovel: z.string(),
  filial_nome: z.string(),
  created_at: z.string().datetime(),
});

// Função para converter dados do formulário para FormData
const toFormData = (data: FuncionarioFormData): FormData => {
  const formData = new FormData();

  formData.append("first_name", data.first_name);
  formData.append("last_name", data.last_name);
  formData.append("email", data.email);
  formData.append("bi", data.bi);
  formData.append("cargo", data.cargo);
  formData.append("telemovel", data.telemovel);
  formData.append("papel", data.papel);
  formData.append("ativo", String(data.ativo));
  formData.append("filial", data.filial);

  if (data.password) {
    formData.append("password", data.password);
  }

  // Endereço (serializado como JSON)
  if (data.endereco) {
    formData.append("endereco", JSON.stringify(data.endereco));
  }

  return formData;
};

export const useFuncionarioMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: FuncionarioFormData) => {
      const formData = toFormData(data);
      const response = await api.post("/organizacao/funcionarios/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
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
    }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (key === "endereco" && value) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await api.patch(
        `/organizacao/funcionarios/${id}/`,
        formData,
      );
      return response.data;
    },
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
    mutationFn: async (id: string) => {
      await api.delete(`/organizacao/funcionarios/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast.success("Funcionário removido com sucesso!");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const response = await api.patch(`/organizacao/funcionarios/${id}/`, {
        ativo,
      });
      return response.data;
    },
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
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.filial) params.append("filial", filters.filial);
      if (filters?.papel) params.append("papel", filters.papel);
      if (filters?.ativo !== undefined)
        params.append("ativo", String(filters.ativo));

      const response = await api.get(
        `/organizacao/funcionarios/${params.toString() ? `?${params}` : ""}`,
      );
      return z
        .array(FuncionarioResponseSchema)
        .parse(response.data.results || response.data);
    },
  });
};

// Hook para buscar funcionário por ID
export const useFuncionario = (id: string) => {
  return useQuery({
    queryKey: ["funcionarios", id],
    queryFn: async () => {
      const response = await api.get(`/organizacao/funcionarios/${id}/`);
      return FuncionarioResponseSchema.parse(response.data);
    },
    enabled: !!id,
  });
};

// Hook para buscar funcionário atual (logado)
export const useFuncionarioAtual = () => {
  return useQuery({
    queryKey: ["funcionarios", "me"],
    queryFn: async () => {
      const response = await api.get("/organizacao/funcionarios/me/");
      return FuncionarioResponseSchema.parse(response.data);
    },
  });
};
