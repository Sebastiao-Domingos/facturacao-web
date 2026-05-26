// src/hooks/empresa/use-stock.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MovimentacaoPayload,
  Stock,
  StockFilters,
} from "@/src/schemas/empresa/afilias/stock-schema";
import { StockService } from "@/src/services/empresa/afilias/stock";

const stockService = new StockService();

// Query keys
export const stockKeys = {
  all: ["stocks"] as const,
  lists: () => [...stockKeys.all, "list"] as const,
  list: (filters?: StockFilters) => [...stockKeys.lists(), filters] as const,
  details: () => [...stockKeys.all, "detail"] as const,
  detail: (id: string) => [...stockKeys.details(), id] as const,
  historico: (stockId: string) =>
    [...stockKeys.all, "historico", stockId] as const,
};

// Hook para listar stocks
export const useStocks = (filters?: StockFilters) => {
  return useQuery({
    queryKey: stockKeys.list(filters),
    queryFn: () => stockService.get(filters),
  });
};

// Hook para buscar stock por ID
export const useStock = (id: string) => {
  return useQuery({
    queryKey: stockKeys.detail(id),
    queryFn: () => stockService.getStock(id),
    enabled: !!id,
  });
};

// Hook para histórico de movimentações
export const useHistoricoStock = (stockId: string) => {
  return useQuery({
    queryKey: stockKeys.historico(stockId),
    queryFn: () => stockService.getHistorico(stockId),
    enabled: !!stockId,
  });
};

// Hook para mutations (CRUD + Movimentação)
export const useStockMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Stock) => stockService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
      toast.success("Stock criado com sucesso!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erro ao criar stock";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Stock) => stockService.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: stockKeys.detail(variables.id),
      });
      toast.success("Stock actualizado com sucesso!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Erro ao actualizar stock";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => stockService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
      toast.success("Stock removido com sucesso!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erro ao remover stock";
      toast.error(message);
    },
  });

  const movimentarMutation = useMutation({
    mutationFn: ({
      stockId,
      payload,
    }: {
      stockId: string;
      payload: MovimentacaoPayload;
    }) => stockService.movimentar(stockId, payload),
    onSuccess: (_, variables) => {
      toast.success("Movimentação executada com sucesso!");
      queryClient.invalidateQueries({
        queryKey: stockKeys.historico(variables.stockId),
      });
      queryClient.invalidateQueries({
        queryKey: stockKeys.detail(variables.stockId),
      });
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.quantidade ||
        "Erro ao executar movimentação";
      toast.error(message);
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    movimentarMutation,
  };
};
