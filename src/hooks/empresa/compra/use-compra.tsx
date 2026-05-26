// src/hooks/empresa/use-compra.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Fornecedor } from "@/src/schemas/empresa/compras/fornecedor-schema";
import { CompraService } from "@/src/services/empresa/compras/compra-service";
import { CompraCreate } from "@/src/schemas/empresa/compras/compra-schema";

const compraService = new CompraService();

export const compraKeys = {
  all: ["compras"] as const,
  fornecedores: () => [...compraKeys.all, "fornecedores"] as const,
  fornecedor: (id: string) => [...compraKeys.fornecedores(), id] as const,
  list: (filters?: Record<string, any>) =>
    [...compraKeys.all, "list", filters] as const,
  detail: (id: string) => [...compraKeys.all, "detail", id] as const,
};

// ========== FORNECEDORES ==========
export const useFornecedores = (filters?: {
  search?: string;
  ativo?: boolean;
  page?: number;
  page_size?: number;
}) => {
  return useQuery({
    queryKey: compraKeys.list({ ...filters, tipo: "fornecedor" }),
    queryFn: () => compraService.listarFornecedores(filters),
  });
};

export const useFornecedor = (id: string) => {
  return useQuery({
    queryKey: compraKeys.fornecedor(id),
    queryFn: () => compraService.getFornecedor(id),
    enabled: !!id,
  });
};

export const useFornecedorMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Fornecedor) => compraService.criarFornecedor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: compraKeys.fornecedores() });
      toast.success("Fornecedor criado com sucesso!");
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.message || "Erro ao criar fornecedor"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Fornecedor> }) =>
      compraService.atualizarFornecedor(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: compraKeys.fornecedores() });
      queryClient.invalidateQueries({ queryKey: compraKeys.fornecedor(id) });
      toast.success("Fornecedor actualizado com sucesso!");
    },
    onError: (error: any) =>
      toast.error(
        error.response?.data?.message || "Erro ao actualizar fornecedor",
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => compraService.eliminarFornecedor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: compraKeys.fornecedores() });
      toast.success("Fornecedor removido com sucesso!");
    },
    onError: (error: any) =>
      toast.error(
        error.response?.data?.message || "Erro ao remover fornecedor",
      ),
  });

  return { createMutation, updateMutation, deleteMutation };
};

// ========== COMPRAS ==========
export const useCompras = (filters?: {
  estado?: string;
  fornecedor?: string;
  filial?: string;
  page?: number;
  page_size?: number;
}) => {
  return useQuery({
    queryKey: compraKeys.list({ ...filters, tipo: "compra" }),
    queryFn: () => compraService.listarCompras(filters),
  });
};

export const useCompra = (id: string) => {
  return useQuery({
    queryKey: compraKeys.detail(id),
    queryFn: () => compraService.getCompra(id),
    enabled: !!id,
  });
};

export const useCompraMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CompraCreate) => compraService.criarCompra(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: compraKeys.all });
      toast.success("Compra criada com sucesso!");
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.message || "Erro ao criar compra"),
  });

  const confirmarMutation = useMutation({
    mutationFn: (id: string) => compraService.confirmarCompra(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: compraKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: compraKeys.list() });
      toast.success("Compra confirmada! Stock actualizado.");
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.message || "Erro ao confirmar compra"),
  });

  return { createMutation, confirmarMutation };
};
