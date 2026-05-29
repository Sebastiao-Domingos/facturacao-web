import { Taxa } from "@/src/schemas/configuracoes/taxa-schema";
import { TaxaService } from "@/src/services/configuracoes/taxas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const service = new TaxaService();

export function useTaxas() {
  return useQuery({
    queryKey: ["taxas"],
    queryFn: async () => {
      const response = await service.get();
      return response;
    },
    staleTime: 1000 * 60 * 5, // Dados "frescos" por 5 minutos
  });
}

export function useTaxaMutations() {
  const queryClient = useQueryClient();

  // Criar Produto
  const createMutation = useMutation({
    mutationFn: (newData: Taxa) => service.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxas"] });
      toast.success("Taxa criada com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao criar a Taxa.", {
        description: error.message,
      }),
  });

  // Atualizar Produto
  const updateMutation = useMutation({
    mutationFn: ({ data }: { data: Taxa }) => service.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxas"] });
      toast.success("Taxa atualizada!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar a Taxa!", {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxas"] });
      toast.success("Taxa Eliminada!");
    },
    onError: (error) => {
      toast.error("Erro ao eliminar a Taxa!", {
        description: error.message,
      });
    },
  });

  return { createMutation, updateMutation };
}
