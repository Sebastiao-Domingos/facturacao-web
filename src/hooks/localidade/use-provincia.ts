// src/hooks/use-products.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProvinciaService } from "@/src/services/localidade/provincia";
import { Provincia } from "@/src/schemas/localidade/provincia-schema";

const service = new ProvinciaService();

export function useProvincias({
  page,
  search,
}: { page?: number; search?: string } = {}) {
  return useQuery<Provincia[]>({
    queryKey: ["provincias"],
    queryFn: async () => {
      const response = await service.get();
      return response;
    },
    staleTime: 1000 * 60 * 5, // Dados "frescos" por 5 minutos
  });
}

export function useProvinciaMutations() {
  const queryClient = useQueryClient();

  // Criar Produto
  const createMutation = useMutation({
    mutationFn: (newData: Provincia) => service.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provincias"] });
      toast.success("Província criada com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao criar a Província.", {
        description: error.message,
      }),
  });

  // Atualizar Produto
  const updateMutation = useMutation({
    mutationFn: ({ data }: { data: Provincia }) => service.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provincias"] });
      toast.success("Província atualizado!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar a província!", {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provincias"] });
      toast.success("Província Eliminado!");
    },
    onError: (error) => {
      toast.error("Erro ao eliminar a Província!", {
        description: error.message,
      });
    },
  });

  return { createMutation, updateMutation };
}
