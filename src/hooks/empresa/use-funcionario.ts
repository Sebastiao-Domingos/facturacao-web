// src/hooks/empresa/use-funcionario.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { toast } from "sonner";
import { FuncionarioFormData } from "@/src/schemas/empresa/afilias/funcionario-schema";
import { z } from "zod";
import { AfiliasSchema } from "@/src/schemas/empresa/afilias/afilia-schema";
import Cookies from "js-cookie";
import { EnderecoSchema } from "@/src/schemas/localidade/municipio-schema";
import { FuncionarioResponse } from "@/src/schemas/empresa/funcionarios/funcionario-schema";

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
  filial_detalhes: AfiliasSchema.optional(),
  endereco: EnderecoSchema.optional(),
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
  formData.append("filial_id", data.filial!);
  formData.append("filial", data.filial!);

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
      // const formData = toFormData(data);
      console.log("Datos do funcionario: ", data);
      const response = await api.post("/organizacao/funcionarios/", data);
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
      const response = await api.put(`/organizacao/funcionarios/${id}/`, data);
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
      if (ativo) {
        const response = await api.post(
          `/organizacao/funcionarios/${id}/ativar/`,
        );
        return response.data;
      }

      const response = await api.post(
        `/organizacao/funcionarios/${id}/desativar/`,
      );
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
      const response = await api.get<FuncionarioResponse>(
        `/organizacao/funcionarios/${id}/`,
      );
      return response.data;
    },
    enabled: !!id,
  });
};

export const useFuncionarioAtual = () => {
  const token = typeof window !== "undefined" ? Cookies.get("token") : null;
  return useQuery({
    queryKey: ["funcionario", "me"],
    queryFn: async () => {
      const response = await api.get<FuncionarioResponse>(
        "/organizacao/funcionarios/me/",
      );
      return response.data;
    },
    enabled: !!token, // ✅ só executa se houver token
    staleTime: 0, // ✅ não mantém dados antigos
  });
};
