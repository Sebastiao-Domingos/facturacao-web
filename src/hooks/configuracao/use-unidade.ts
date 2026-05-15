import { Unidade } from "@/src/schemas/configuracoes/unidade-schema";
import { UnidadeService } from "@/src/services/configuracoes/unidade";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const service = new UnidadeService();

export function useUnidades() {
  return useQuery({
    queryKey: ["unidades"],
    queryFn: async () => {
      const response = await service.get();
      return response;
    },
    staleTime: 1000 * 60 * 5, // Dados "frescos" por 5 minutos
  });
}

export function useUnidadeMutations() {
  const queryClient = useQueryClient();

  // Criar Produto
  const createMutation = useMutation({
    mutationFn: (newData: Unidade) => service.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      toast.success("Unidade criada com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao criar a Unidade.", {
        description: error.message,
      }),
  });

  // Atualizar Produto
  const updateMutation = useMutation({
    mutationFn: ({ data }: { data: Unidade }) => service.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      toast.success("Unidade atualizada!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar a Unidade!", {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      toast.success("Unidade Eliminada!");
    },
    onError: (error) => {
      toast.error("Erro ao eliminar a Unidade!", {
        description: error.message,
      });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
