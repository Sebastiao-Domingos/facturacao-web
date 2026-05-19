// src/hooks/empresa/use-clientes.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clienteService } from "../../services/empresa/cliente";
import {
  ClienteFormData,
  ClienteResponse,
  ClienteList,
} from "@/src/schemas/empresa/clientes/cliente-schema";

// Query keys
export const clienteKeys = {
  all: ["clientes"] as const,
  lists: () => [...clienteKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...clienteKeys.lists(), filters] as const,
  details: () => [...clienteKeys.all, "detail"] as const,
  detail: (id: string) => [...clienteKeys.details(), id] as const,
};

// Hook para listar clientes
export const useClientes = (filters?: {
  search?: string;
  tipo?: "P" | "E";
  ativo?: boolean;
  page?: number;
  page_size?: number;
}) => {
  return useQuery({
    queryKey: clienteKeys.list(filters || {}),
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (filters?.search) params.search = filters.search;
      if (filters?.tipo) params.tipo = filters.tipo;
      if (filters?.ativo !== undefined) params.ativo = filters.ativo;
      if (filters?.page) params.page = filters.page;
      if (filters?.page_size) params.page_size = filters.page_size;

      const response = await clienteService.get(params);
      return response;
    },
  });
};

// Hook para buscar cliente por ID
export const useCliente = (id: string) => {
  return useQuery({
    queryKey: clienteKeys.detail(id),
    queryFn: () => clienteService.getById(id),
    enabled: !!id,
  });
};

// Hook para mutations (CRUD)
// src/hooks/empresa/use-clientes.ts

export const useClienteMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: ClienteFormData) => clienteService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clienteKeys.lists() });
      toast.success("Cliente criado com sucesso!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erro ao criar cliente";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ClienteFormData>;
    }) => clienteService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clienteKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: clienteKeys.detail(variables.id),
      });
      toast.success("Cliente actualizado com sucesso!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Erro ao actualizar cliente";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clienteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clienteKeys.lists() });
      toast.success("Cliente desactivado com sucesso!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Erro ao desactivar cliente";
      toast.error(message);
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => clienteService.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clienteKeys.lists() });
      toast.success("Cliente activado com sucesso!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Erro ao activar cliente";
      toast.error(message);
    },
  });

  // ✅ Corrigido: toggleStatusMutation com tipo consistente
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      if (ativo) {
        return await clienteService.activate(id);
      } else {
        await clienteService.delete(id);
        return { success: true }; // Retorna um objeto consistente
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clienteKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: clienteKeys.detail(variables.id),
      });
      toast.success(
        variables.ativo
          ? "Cliente activado com sucesso!"
          : "Cliente desactivado com sucesso!",
      );
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erro ao alterar status do cliente",
      );
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    activateMutation,
    toggleStatusMutation,
  };
};
