// src/hooks/use-products.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Provincia } from "@/src/schemas/localidade/provincia-schema";
import { MunicipioService } from "@/src/services/localidade/municipio";
import { PaginatedResponse } from "@/src/types";
import { Municipio } from "@/src/schemas/localidade/municipio-schema";

const service = new MunicipioService();

export function useMunicipios({
  page,
  search,
}: { page?: number; search?: string } = {}) {
  return useQuery<PaginatedResponse<Municipio>>({
    queryKey: ["municipios"],
    queryFn: async () => {
      const response = await service.get();
      return response;
    },
    staleTime: 1000 * 60 * 5, // Dados "frescos" por 5 minutos
  });
}

export function useMunicipioMutations() {
  const queryClient = useQueryClient();

  // Criar Produto
  const createMutation = useMutation({
    mutationFn: (newData: Municipio) => service.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["municipios"] });
      toast.success("Município criada com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao criar a Município.", {
        description: error.message,
      }),
  });

  // Atualizar Produto
  const updateMutation = useMutation({
    mutationFn: ({ data }: { data: Municipio }) => service.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["municipios"] });
      toast.success("Município atualizado!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar a Município!", {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["municipios"] });
      toast.success("Município Eliminado!");
    },
    onError: (error) => {
      toast.error("Erro ao eliminar a Município!", {
        description: error.message,
      });
    },
  });

  return { createMutation, updateMutation };
}
