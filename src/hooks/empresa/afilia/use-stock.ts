import { Stock } from "@/src/schemas/empresa/afilias/stock-schema";
import { StockService } from "@/src/services/empresa/afilias/stock";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const service = new StockService();

export function useStock() {
  return useQuery({
    queryKey: ["stock"],
    queryFn: async () => {
      const response = await service.get();
      return response;
    },
    staleTime: 1000 * 60 * 5, // Dados "frescos" por 5 minutos
  });
}

export function useStockMutations() {
  const queryClient = useQueryClient();

  // Criar Produto
  const createMutation = useMutation({
    mutationFn: (newData: Stock) => service.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      toast.success("Stock criado com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao criar o Stock.", {
        description: error.message,
      }),
  });

  // Atualizar Produto
  const updateMutation = useMutation({
    mutationFn: ({ data }: { data: Stock }) => service.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      toast.success("Stock atualizado!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar o Stock!", {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      toast.success("Stock Eliminado!");
    },
    onError: (error) => {
      toast.error("Erro ao eliminar o Stock!", {
        description: error.message,
      });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
