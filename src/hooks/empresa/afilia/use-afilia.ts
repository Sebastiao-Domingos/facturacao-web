import { Afilias } from "@/src/schemas/empresa/afilias/afilia-schema";
import { AfiliaService } from "@/src/services/empresa/afilias/afilia";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const service = new AfiliaService();

export function useAfilia() {
  return useQuery({
    queryKey: ["afilias"],
    queryFn: async () => {
      const response = await service.get();
      return response;
    },
    staleTime: 1000 * 60 * 5, // Dados "frescos" por 5 minutos
  });
}

export function useFilial(id: string) {
  return useQuery({
    queryKey: ["afilias", id],
    queryFn: async () => {
      const response = await service.getById(id);
      return response;
    },
    enabled: !!id,
  });
}
export function useAfiliaMutations() {
  const queryClient = useQueryClient();

  // Criar Produto
  const createMutation = useMutation({
    mutationFn: (newData: Afilias) => service.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afilias"] });
      toast.success("Afilia criada com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao criar a Afilia.", {
        description: error.message,
      }),
  });

  // Atualizar Produto
  const updateMutation = useMutation({
    mutationFn: ({ data }: { data: Afilias }) => service.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afilias"] });
      toast.success("Afilia atualizado!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar a Afilia!", {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afilias"] });
      toast.success("Afilia Eliminado!");
    },
    onError: (error) => {
      toast.error("Erro ao eliminar a Afilia!", {
        description: error.message,
      });
    },
  });

  return { createMutation, updateMutation };
}
